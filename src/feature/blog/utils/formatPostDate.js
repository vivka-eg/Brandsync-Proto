export function formatPostDate(isoDate) {
  if (!isoDate) return "";
  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return "";
  }
}

export function formatRelativePostDate(isoDate) {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    const now = Date.now();
    const sec = Math.floor((now - d.getTime()) / 1000);
    if (sec < 45) return "just now";
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min} min ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
    const day = Math.floor(hr / 24);
    if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`;
    const week = Math.floor(day / 7);
    if (week < 5) return `${week} week${week === 1 ? "" : "s"} ago`;
    return formatPostDate(isoDate);
  } catch {
    return "";
  }
}
