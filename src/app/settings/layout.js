import MCPAuthWrapper from "@/components/auth/MCPAuthWrapper";
import Header from "@/components/Header";
import { MCPAuthContextProvider } from "@/context/mcp/MCPAuthContext";
import SettingsSidebar from "@/feature/settings/SettingsSidebar";
import Box from "@mui/material/Box";

export const metadata = { title: "Settings - EG BrandSync" };

export default function SettingsLayout({ children }) {
  return (
    <MCPAuthContextProvider>
      <MCPAuthWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              mt: "64px",
            }}
          >
            <Box sx={{ display: "flex", flex: 1 }}>
              <SettingsSidebar />

              <Box
                component="main"
                sx={{
                  flex: 1,
                  p: { xs: 3, md: 4 },
                  bgcolor: "background.default",
                  overflowY: "auto",
                }}
              >
                {children}
              </Box>
            </Box>
          </Box>
        </Box>
      </MCPAuthWrapper>
    </MCPAuthContextProvider>
  );
}
