import { cases } from "../../data/content";
import { SITE_URL } from "../../site-config";
import CaseStudyView from "./CaseStudyView";

export function generateStaticParams() {
  return cases.map((c) => ({ caseId: c.n }));
}

export async function generateMetadata({ params }) {
  const { caseId } = await params;
  const cs = cases.find((c) => c.n === caseId) || cases[0];
  const title = `${cs.title} — ${cs.client} Case Study`;
  const fullTitle = `${title} | Hotshoes Asia`;
  const description = cs.impact || cs.experience || cs.challenge;
  const url = `${SITE_URL}/case-study/${cs.n}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: "article",
      images: [{ url: cs.photo, alt: cs.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [cs.photo],
    },
  };
}

export default async function CaseStudyPage({ params }) {
  const { caseId } = await params;
  const cs = cases.find((c) => c.n === caseId) || cases[0];
  const url = `${SITE_URL}/case-study/${cs.n}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: cs.title,
    headline: cs.title,
    description: cs.impact || cs.experience || cs.challenge,
    image: `${SITE_URL}${cs.photo}`,
    url,
    about: cs.client,
    creator: { "@type": "Organization", name: "Hotshoes Asia", url: SITE_URL },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/#work` },
      { "@type": "ListItem", position: 3, name: cs.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CaseStudyView caseId={caseId} />
    </>
  );
}
