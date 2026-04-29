export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://skill-lenz.vercel.app/sitemap.xml",
  };
}