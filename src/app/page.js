import LandingPage from "@/feature/landing/LandingPage";
import {
  getAnnouncementPosts,
  getFeaturedPosts,
  getRecentPosts,
  isWordPressConfigured,
} from "@/lib/wordpress";

export const revalidate = 120;

export default async function Home() {
  const [featuredHeroPosts, announcementsPool] = await Promise.all([
    getFeaturedPosts(8),
    getAnnouncementPosts(6),
  ]);

  const featuredIds = new Set(featuredHeroPosts.map((p) => p.id));

  let announcements = announcementsPool.filter((p) => !featuredIds.has(p.id)).slice(0, 4);

  if (announcements.length === 0 && isWordPressConfigured()) {
    const { posts: recent, error } = await getRecentPosts(12);
    if (!error && recent.length > 0) {
      announcements = recent.filter((p) => !featuredIds.has(p.id)).slice(0, 4);
    }
  }

  return (
    <LandingPage announcements={announcements} featuredHeroPosts={featuredHeroPosts} />
  );
}
