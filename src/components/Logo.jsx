"use client";
import { Box } from "@mui/material";
import Image from "next/image";
import logo from "../../public/brandsync_logo.svg";
import { useRouter } from "next/navigation";

function Logo() {
  const router = useRouter();

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      onClick={() => router.push("/")}
    >
      <Image
        src={logo}
        alt="EG Brandsync"
        width={200}
        height={40}
        priority
      />
    </Box>
  );
}

export default Logo;
