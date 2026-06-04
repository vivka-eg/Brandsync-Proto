import { notFound } from "next/navigation";
import BlogPostPage from "@/feature/blog/components/BlogPostPage";
import { getPostBySlug, getRelatedPosts } from "@/lib/wordpress";

export const revalidate = 120;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Post not found | EG Brandsync" };
  }
  return {
    title: `${post.title} | EG Brandsync`,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostRoute({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }
  const relatedPosts = await getRelatedPosts({
    postId: post.id,
    categoryIds: post.categories?.map((c) => c.id) ?? [],
    limit: 3,
  });

  return <BlogPostPage post={post} relatedPosts={relatedPosts} />;
}
