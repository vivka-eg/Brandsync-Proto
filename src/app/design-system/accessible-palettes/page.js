import { AccessiblePaletteContextProvider } from "@/context/design-system/AccessiblePaletteContext";
import AccessiblePalette from "@/feature/accessible-palettes/AccessiblePalettePage";
import { Suspense } from "react";

export const metadata = {
  title: "Accessible Palettes | EG Brandsync",
};

function page() {
  return (
    <AccessiblePaletteContextProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <AccessiblePalette />
      </Suspense>
    </AccessiblePaletteContextProvider>
  );
}

export default page;
