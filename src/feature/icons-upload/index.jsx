"use client";
import { IconsUploadContextProvider } from "./context/IconsUploadContext";
import IconsUpload from "./components/IconsUpload";

function UploadIconsPage() {
  return (
    <IconsUploadContextProvider>
      <IconsUpload />
    </IconsUploadContextProvider>
  );
}

export default UploadIconsPage;
