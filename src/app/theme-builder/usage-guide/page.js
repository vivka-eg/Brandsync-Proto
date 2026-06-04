import ThemeUsageGuide from "@/feature/theme-builder/ThemeUsageGuide";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Theme Usage Guide | EG Brandsync",
  description:
    "Learn how to implement EG design tokens in your projects using CSS, SCSS, JSON, or JavaScript.",
};

function page() {
  return (
    <>
      <Header />
      <ThemeUsageGuide />
      <Footer />
    </>
  );
}

export default page;
