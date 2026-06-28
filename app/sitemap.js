import { cases } from "./data/content";
import { SITE_URL } from "./site-config";

export default function sitemap() {
  const homepage = {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
  };

  const caseStudies = cases.map((c) => ({
    url: `${SITE_URL}/case-study/${c.n}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [homepage, ...caseStudies];
}
