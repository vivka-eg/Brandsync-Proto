"use client";
import Box from "@mui/material/Box";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import CustomIconButton from "@/components/shared/IconButton";
import { Plus, SignOut, User } from "phosphor-react";
import { Avatar, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
// import { useAuthContext } from "@/context/auth/AuthContext";
import { logout } from "@/lib/keycloak";
import { useToast } from "@/context/shared/ToastContext";
export default function Header() {
  const theme = useTheme();
  const router = useRouter();
  // const { setUser } = useAuthContext();
  const { setToast } = useToast();

  const handleLogout = async () => {
    // Clear the token from localStorage :
    localStorage.removeItem("keycloak_token");

    // clear the user :
    // setUser(null);

    // logout from Keycloak :
    try {
      await logout();
    } catch (error) {
      setToast({
        open: true,
        type: "error",
        message: "Logout unsuccessful. Please try again.",
        variant: "filled",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: "32px",
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        py: 1,
      }}
    >
      {/* Left: Breadcrumbs */}
      <Box>
        <Logo />
      </Box>

      {/* Right: SearchBar, ThemeToggle and MenuButton */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 2,
          // flex: 1,
        }}
      >
        <CustomIconButton
          text="Add Icons"
          Icon={Plus}
          onClick={() => router.push("/digital-assets/icons/admin/upload")}
        />
        <ThemeToggle />

        <Avatar>
          <User size={24} weight="bold" color={"#CBD3D6"} />
        </Avatar>

        <SignOut
          color={theme.palette.action.active}
          size={32}
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        />
      </Box>
    </Box>
  );
}
