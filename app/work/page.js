import { SITE_URL } from "../site-config";
import WorkView from "./WorkView";

export const metadata = {
  title: "All Case Studies",
  description: "Explore Hotshoes Asia's full portfolio of brand activations, corporate events, integrated marketing campaigns, and more across Asia.",
  alternates: { canonical: `${SITE_URL}/work` },
  openGraph: {
    title: "All Case Studies | Hotshoes Asia",
    description: "Explore Hotshoes Asia's full portfolio of brand activations, corporate events, integrated marketing campaigns, and more across Asia.",
    url: `${SITE_URL}/work`,
    type: "website",
  },
};

export default function WorkPage() {
  return <WorkView />;
}
