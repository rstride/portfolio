import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getSortedPostsData } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://rstride.fr";
  const staticRoutes = ["/", "/services", "/blog", "/contact", "/legal/disclosure"];
  const serviceRoutes = site.services.map((service) => `/services/${service.slug}`);
  const blogRoutes = getSortedPostsData().map((post) => `/blog/${post.slug}`);

  const routes = [...staticRoutes, ...serviceRoutes, ...blogRoutes].map((route) => ({
    url: `${base}${route}`,
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.7,
  }));
  return routes;
}
