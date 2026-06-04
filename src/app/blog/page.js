import BlogIndexPage from "@/feature/blog/components/BlogIndexPage";
import {
  getBlogCategories,
  getFeaturedPosts,
  getPostsList,
  isWordPressConfigured,
} from "@/lib/wordpress";

export const metadata = {
  title: "BrandSync Blogs | EG BrandSync",
  description:
    "Expert insights, team updates, and best practices — product news and articles from the BrandSync team.",
};

export const revalidate = 120;

export default async function BlogArchivePage() {
  if (!isWordPressConfigured()) {
    return (
      <BlogIndexPage
        featuredPosts={[]}
        categories={[]}
        posts={[]}
        totalPages={0}
        featuredPostIds={[]}
        loadError={false}
        configured={false}
      />
    );
  }

  const featuredPosts = await getFeaturedPosts(3);
  const featuredPostIds = featuredPosts.map((p) => p.id);

  const [categories, listResult] = await Promise.all([
    getBlogCategories(),
    getPostsList({ page: 1, perPage: 12, excludeIds: featuredPostIds }),
  ]);

  return (
    <BlogIndexPage
      featuredPosts={featuredPosts}
      categories={categories}
      posts={listResult.posts}
      totalPages={listResult.totalPages}
      featuredPostIds={featuredPostIds}
      loadError={listResult.error}
      configured
    />
  );
}
