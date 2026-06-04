/**
 * @typedef {{ src: string, alt: string, width: number | null, height: number | null }} WpGalleryImage
 * @typedef {{ type: 'html', html: string }} WpHtmlPart
 * @typedef {{ type: 'gallery', images: WpGalleryImage[] }} WpGalleryPart
 * @typedef {WpHtmlPart | WpGalleryPart} WpContentPart
 */

function readAttr(tag, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i");
  const m = tag.match(re);
  return m ? (m[2] ?? m[3] ?? "") : "";
}

function readNumericAttr(tag, name) {
  const raw = readAttr(tag, name);
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

/**
 * @param {string} galleryHtml
 * @returns {WpGalleryImage[]}
 */
function extractImagesFromGalleryHtml(galleryHtml) {
  /** @type {WpGalleryImage[]} */
  const images = [];
  const imgRe = /<img\b[^>]*>/gi;
  let match;
  while ((match = imgRe.exec(galleryHtml)) !== null) {
    const tag = match[0];
    const src = readAttr(tag, "src");
    if (!src) continue;
    images.push({
      src,
      alt: readAttr(tag, "alt"),
      width: readNumericAttr(tag, "width"),
      height: readNumericAttr(tag, "height"),
    });
  }
  return images;
}

/**
 * Split WordPress post HTML into HTML segments and gallery image lists.
 *
 * @param {string} html
 * @returns {WpContentPart[]}
 */
export function parseWpPostHtml(html) {
  if (!html || typeof html !== "string") {
    return [{ type: "html", html: "" }];
  }

  /** @type {WpContentPart[]} */
  const parts = [];
  let cursor = 0;

  while (cursor < html.length) {
    const slice = html.slice(cursor);
    const openMatch = slice.match(/<figure[^>]*\bwp-block-gallery\b[^>]*>/i);
    if (!openMatch || openMatch.index === undefined) {
      const rest = html.slice(cursor);
      if (rest) parts.push({ type: "html", html: rest });
      break;
    }

    const galleryOpenStart = cursor + openMatch.index;
    if (galleryOpenStart > cursor) {
      parts.push({ type: "html", html: html.slice(cursor, galleryOpenStart) });
    }

    let depth = 0;
    let galleryEnd = -1;
    const tagRe = /<\/?figure\b[^>]*>/gi;
    tagRe.lastIndex = galleryOpenStart;
    let tagMatch;
    while ((tagMatch = tagRe.exec(html)) !== null) {
      const tag = tagMatch[0];
      if (tag.startsWith("</")) {
        depth -= 1;
        if (depth === 0) {
          galleryEnd = tagMatch.index + tag.length;
          break;
        }
      } else {
        depth += 1;
      }
    }

    if (galleryEnd === -1) {
      parts.push({ type: "html", html: html.slice(galleryOpenStart) });
      break;
    }

    const galleryHtml = html.slice(galleryOpenStart, galleryEnd);
    const images = extractImagesFromGalleryHtml(galleryHtml);
    if (images.length > 0) {
      parts.push({ type: "gallery", images });
    } else {
      parts.push({ type: "html", html: galleryHtml });
    }
    cursor = galleryEnd;
  }

  return parts.length > 0 ? parts : [{ type: "html", html }];
}
