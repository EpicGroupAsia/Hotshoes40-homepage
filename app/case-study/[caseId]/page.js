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
  return <CaseStudyView caseId={caseId} />;
}
