import { MetadataRoute } from "next";
import { WORKS_DATA } from "@/data/works";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://redorchidfilms.com";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  const workPages = WORKS_DATA.map((work) => ({
    url: `${baseUrl}/work/${work.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...workPages];
}
