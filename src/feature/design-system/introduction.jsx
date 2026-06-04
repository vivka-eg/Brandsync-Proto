"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import TopHeader from "@/components/shared/TopHeader";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import { Stack } from "@mui/material";
import LazyImage from "@/components/shared/LazyImage";
import { useRouter } from "next/navigation";
import { getIntroduction } from "@/api/design-system/introduction";
import Loader from "@/components/shared/Loader";
import VpnContentAlert from "@/components/shared/VpnContentAlert";

const QuickLinkCard = ({ quickLink }) => {
  const { title, description, assetURL, href } = quickLink;
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        gap: 1,
        flex: 1,
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
        },
      }}
      onClick={() => {
        // window.location.href = href;
        if (href) {
          router.push(href);
        }
      }}
    >
      {assetURL && (
        <LazyImage
          src={assetURL}
          alt={title}
          width={100}
          height={100}
          style={{ height: "330px", objectFit: "cover", width: "100%" }}
          enableModal={false}
          sx={{ cursor: "pointer" }}
        />
      )}

      <Stack sx={{ p: 2, gap: 1 }}>
        <Typography variant="h6" gutterBottom color="text.primary">
          {title}
        </Typography>
        <Typography variant="body1" gutterBottom color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </Box>
  );
};

export default function IntroductionPage() {
  const [introduction, setIntroduction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("understanding-brandsync");

  useEffect(() => {
    getIntroduction().then((data) => {
      setIntroduction(data?.error ? null : (data?.[0] ?? null));
      setLoading(false);
    });
  }, []);
  const [quickLinks, setQuickLinks] = useState([
    {
      title: "Foundation",
      description:
        "Foundation covers the basics like layout, spacing, typography, and logo placement that bring structure and consistency to all our designs.",
      assetURL: "/overview/introduction/foundation.svg",
      href: "/design-system/foundation/layout",
    },
    {
      title: "Accessibility",
      description:
        "Making sure our products are usable by everyone, including people with disabilities, through thoughtful, inclusive design choices.",
      assetURL: "/overview/introduction/accessibility.svg",
      href: "/design-system/accessibility",
    },
    {
      title: "Components",
      description:
        "A collection of reusable building blocks that help create consistent and user-friendly interfaces across all EG products.",
      assetURL: "/overview/introduction/components.svg",
      href: "/design-system/components",
    },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const understanding = document.getElementById("understanding-brandsync");
      const approach = document.getElementById("our-approach");
      const scrollY = window.scrollY || window.pageYOffset;
      const offset = 120; // adjust if you have a fixed header
      if (approach && scrollY + offset >= approach.offsetTop) {
        setActiveSection("our-approach");
      } else if (understanding && scrollY + offset >= understanding.offsetTop) {
        setActiveSection("understanding-brandsync");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if introduction data is available
  if (loading) return <Loader />;

  if (!introduction || !introduction.Article) {
    return <VpnContentAlert title="Introduction" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        p: 1,
        bgcolor: "background.default",
        // width: "calc(100vw - 280px)",
        pb: "130px",
      }}
    >
      {/* Header Section */}
      <TopHeader
        title={introduction.Article?.Title || "Introduction"}
        description={introduction.Article?.Description || ""}
        assetURL={introduction.Article?.Video}
      />

      <Stack gap={"64px"}>
        {/* Main Content Section */}
        <Stack gap={"64px"}>
          {introduction.Article?.Blocks?.map((block, index) => (
            <MarkdownRenderer content={block.Content} key={index} />
          )) || (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No content blocks available
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Quick Links */}
        <Stack gap="24px">
          <Typography variant="h5" color="text.primary">
            Quick Links
          </Typography>
          {/* <Stack direction={"row"} spacing={2} justifyContent={"stretch"}>
            {quickLinks.map((link, index) => (
              <QuickLinkCard quickLink={link} key={index} />
            ))}
          </Stack> */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              "@media (max-width: 1046px)": {
                gridTemplateColumns: "repeat(2,1fr)",
              },
              "@media (max-width: 698px)": {
                gridTemplateColumns: "repeat(1,1fr)",
              },
              gap: "16px",
            }}
          >
            {quickLinks.map((link, index) => (
              <QuickLinkCard quickLink={link} key={index} />
            ))}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
