export async function downloadBlob(url, filename = "download.zip") {
  try {
    const apiUrl =
      `/api/download-asset?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
}

export async function downloadZipBundle(id, name) {
  return downloadBlob(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/asset-tracking/${id}/download-with-sizes`,
    `${name}.zip`,
  );
}
