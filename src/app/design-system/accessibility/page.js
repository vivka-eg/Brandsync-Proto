import AccessibilityPage from "@/feature/accessibility/AccessibilityPage";
import { strapiServer } from "@/strapi/apiHandler";

export const metadata = {
  title: "Accessibility | EG Brandsync",
  description: "EG Brandsync Accessibility",
};

export const dynamic = "force-dynamic";

export default async function page() {
  const data = await strapiServer.getSingleType("accessibility");
  return <AccessibilityPage data={data?.error ? null : (data ?? null)} />;
}
