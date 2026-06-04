"use client";
import { Stack } from "@mui/material";
import Image from "next/image";
import React from "react";

function GenericLogo({
  logo = true,
  horizontal,
  selectedColor,
  mode = "light",
}) {
  const logoURL = `/accessible-palettes/${selectedColor}.svg`;

  if (horizontal) {
    return (
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
      >
        <Image src={logoURL} alt="Logo" width={44} height={44} />
        <Image
          src={`/logo-wordmark/${mode === "light" ? "grey" : "white"}.svg`}
          alt="Enterprise Gateway"
          height={20}
          width={180}
        />
      </Stack>
    );
  }

  if (logo)
    return (
      <Stack>
        <Image src={logoURL} alt="Logo" width={44} height={44} />
      </Stack>
    );
}

export default GenericLogo;
