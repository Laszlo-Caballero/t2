import { api } from "./api";

/**
 * Builds an absolute URL for backend static assets (e.g. charts, processed images)
 * with a cache-busting timestamp salt query parameter.
 */
export const getImageUrl = (path: string, salt: number) => {
  if (!path) return "";
  let url = "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    url = path;
  } else {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const base = api.defaults.baseURL || "http://localhost:8000";
    const cleanBase = base.endsWith("/") ? base : `${base}/`;
    url = `${cleanBase}${cleanPath}`;
  }
  return `${url}?t=${salt}`;
};
