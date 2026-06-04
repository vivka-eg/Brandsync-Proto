import CategoryPatternsPage from "@/feature/mcp-patterns/CategoryPatternsPage";

export const metadata = {
  title: "Patterns - BrandSync MCP",
  description: "Browse and generate production-ready UI patterns for your framework using BrandSync tokens.",
};

export default async function Page({ params }) {
  const { categoryId } = await params;
  return <CategoryPatternsPage categoryId={categoryId} />;
}
