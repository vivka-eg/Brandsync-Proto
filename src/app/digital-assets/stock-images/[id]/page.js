import { calculateOrientation } from "@/utils/imageUtils";
import { notFound } from "next/navigation";
import StockImagesDetailPage from "@/feature/stock-images-detail/StockImagesDetailPage";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_INTERNAL_API_URL ||
  "https://api.brand.dev.egsync.com/api";

const GENERIC_BUSINESS_UNITS = new Set(["", "null", "general", "other", "all"]);

function formatBusinessUnitLabel(value) {
  return String(value || "")
    .trim()
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function fetchPhotoData(id) {
  const token = process.env.STRAPI_API_ADMIN_TOKEN;
  if (!token) return null;

  try {
    // Fetch asset data and signed URL in parallel — saves one round-trip vs sequential
    const [assetRes, signedUrlRes] = await Promise.all([
      fetch(`${STRAPI_API_URL}/asset-tracking/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch(`${STRAPI_API_URL}/asset-tracking/${id}/signed-url`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
    ]);

    if (!assetRes.ok) return null;

    const apiData = await assetRes.json();
    const asset = apiData.data || apiData;
    if (!asset?.id) return null;

    let signedUrl = null;
    if (signedUrlRes.ok) {
      const urlData = await signedUrlRes.json();
      signedUrl = urlData.signedUrl || urlData.data?.signedUrl || urlData.url;
    }

    const rawBusinessUnit = String(asset.businessUnit || "").trim();
    const normalizedBusinessUnit = rawBusinessUnit.toLowerCase();
    let businessUnitName = "";

    if (rawBusinessUnit && !GENERIC_BUSINESS_UNITS.has(normalizedBusinessUnit)) {
      try {
        const buRes = await fetch(
          `${STRAPI_API_URL}/categories/${encodeURIComponent(rawBusinessUnit)}`,
          { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
        );
        if (buRes.ok) {
          const buData = await buRes.json();
          const buRecord = buData.data || buData;
          businessUnitName =
            buRecord?.name || buRecord?.title || buRecord?.label || "";
        }
      } catch {}

      if (
        !businessUnitName &&
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          rawBusinessUnit
        )
      ) {
        businessUnitName = formatBusinessUnitLabel(rawBusinessUnit);
      }
    }

    let tags = Array.isArray(asset.tags) ? asset.tags : [];
    let containsPeopleValue = null;

    if (tags.includes("_contains-people")) {
      containsPeopleValue = true;
      tags = tags.filter(
        (t) =>
          t !== "_contains-people" &&
          t !== "_no-people" &&
          t !== "_portrait" &&
          t !== "_landscape" &&
          t !== "_square"
      );
    } else if (tags.includes("_no-people")) {
      containsPeopleValue = false;
      tags = tags.filter(
        (t) =>
          t !== "_contains-people" &&
          t !== "_no-people" &&
          t !== "_portrait" &&
          t !== "_landscape" &&
          t !== "_square"
      );
    } else if (asset.metadata && asset.metadata.containsPeople !== undefined) {
      containsPeopleValue = Boolean(asset.metadata.containsPeople);
      tags = tags.filter(
        (t) => t !== "_portrait" && t !== "_landscape" && t !== "_square"
      );
    } else if (
      asset.containsPeople !== null &&
      asset.containsPeople !== undefined
    ) {
      containsPeopleValue =
        typeof asset.containsPeople === "string"
          ? asset.containsPeople.toLowerCase() === "true"
          : Boolean(asset.containsPeople);
      tags = tags.filter(
        (t) => t !== "_portrait" && t !== "_landscape" && t !== "_square"
      );
    } else {
      tags = tags.filter(
        (t) => t !== "_portrait" && t !== "_landscape" && t !== "_square"
      );
    }

    const origWidth = asset.metadata?.[1] || 4000;
    const origHeight = asset.metadata?.[0] || 3000;
    const isPortrait = origHeight > origWidth;
    const s = (w, h) =>
      isPortrait ? { width: h, height: w } : { width: w, height: h };

    return {
      id: asset.id,
      title: asset.assetName || "Untitled",
      description: asset.description || "",
      businessUnit:
        asset.businessUnit && asset.businessUnit !== "null"
          ? asset.businessUnit
          : "",
      businessUnitId:
        asset.businessUnitId && asset.businessUnitId !== "null"
          ? asset.businessUnitId
          : asset.businessUnit && asset.businessUnit !== "null"
          ? asset.businessUnit
          : "",
      businessUnitName,
      category: asset.categories || "",
      tags,
      containsPeople: containsPeopleValue,
      orientation: calculateOrientation(
        asset.metadata?.[1] || 4000,
        asset.metadata?.[0] || 3000
      ),
      fullImage: signedUrl,
      fullSize: signedUrl,
      thumbnail: signedUrl,
      dimensions: { width: origWidth, height: origHeight },
      sizes: [
        { label: "Thumbnail", ...s(208, 156), url: signedUrl },
        { label: "Small", ...s(500, 375), url: signedUrl },
        { label: "Medium", ...s(750, 563), url: signedUrl },
        { label: "Large", ...s(1000, 750), url: signedUrl },
        { label: "Original", width: origWidth, height: origHeight, url: signedUrl },
      ],
      gender: Array.isArray(asset.gender)
        ? asset.gender[0] || null
        : asset.gender || null,
      ethnicity: Array.isArray(asset.ethnicity)
        ? asset.ethnicity[0] || null
        : asset.ethnicity || null,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      s3Key: asset.s3Key,
      fileSize: asset.fileSize,
      assetType: asset.assetType,
    };
  } catch {
    return null;
  }
}

export default async function PhotoDetailPage({ params }) {
  const { id } = await params;
  const photo = await fetchPhotoData(id);

  if (!photo) notFound();

  // key={id} forces the Client Component to fully remount when navigating
  // between different photos (client-side routing), resetting all local state.
  return <StockImagesDetailPage key={id} initialPhoto={photo} />;
}
