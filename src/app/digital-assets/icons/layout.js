"use client";
import UserHeader from "@/components/Header";
import IconTypesAndCategoryContextProvider, {
  IconTypesAndCategoryContext,
} from "@/context/digital-assets/IconTypesAndCategoryContext";
import { Box } from "@mui/material";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth/AuthContext";
import UnauthorizedPage from "@/components/shared/Unauthorized";
import Header from "@/components/Header";
import ComingSoon from "@/components/shared/ComingSoon";
import { useAppEnv } from "@/hooks/useAppEnv";

function Layout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/digital-assets/icons/admin");
  const { role } = useAuthContext();
  const { isDev } = useAppEnv();
  const requiredRoles = isAdminRoute
    ? ["SUPERADMIN", "ADMIN"]
    : ["USER", "SUPERADMIN", "ADMIN"];

  // return coming soon page for now
  // return (
  //   <>
  //     <Header />
  //     <ComingSoon pageName="Icons" />
  //   </>
  // );

  // full layout content (to be used later)

  // if (!isDev) notFound();

  if (!requiredRoles.includes(role)) notFound();

  return (
    <IconTypesAndCategoryContextProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <UserHeader />
        <Box
          component="main"
          sx={{
            mt: "64px",
            flex: 1,
            overflowX: "clip",
            bgcolor: "background.default",
          }}
        >
          {children}
        </Box>
      </Box>
    </IconTypesAndCategoryContextProvider>
  );
}

export default Layout;
