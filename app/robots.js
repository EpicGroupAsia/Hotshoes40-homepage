import { SITE_URL } from "./site-config";

export default function robots() {
  // UAT (staging) is publicly viewable, so keep it out of search indexes.
  if (process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
