/**
 * Composite a PNG data URL onto a white canvas and encode as JPEG.
 * Avoids passing `backgroundColor` into html-to-image for JPEG, which applies
 * styles to the cloned node and can break the export (blank image).
 */
export function pngDataUrlToJpegDataUrl(pngDataUrl, width, height, quality = 0.92) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context."));
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("Failed to decode PNG for JPEG export."));
    img.src = pngDataUrl;
  });
}
