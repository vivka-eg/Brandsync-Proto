import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeBuilder from "@/feature/theme-builder/ThemeBuilder";
import { Box } from "@mui/material";

export const metadata = {
  title: "Theme Builder - Build Your EG Theme",
  description: "Build and customize your product themes with our visual theme builder. Export to CSS, SCSS, JSON, or JavaScript.",
};

function page() {
  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Header />
      <Box
        className="theme-builder-scroll"
        sx={{
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          overflowX: "hidden",
          mt: "64px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box component="main" id="main-content" sx={{ flex: 1 }}>
          <ThemeBuilder />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default page;
