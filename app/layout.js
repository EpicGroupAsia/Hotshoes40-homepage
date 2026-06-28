import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./site-config";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — 40 Years of Moving Brands Forward`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — 40 Years of Moving Brands Forward`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_MY",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — 40 Years of Moving Brands Forward`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo-white.png`,
  description: SITE_DESCRIPTION,
  foundingDate: "1986",
  areaServed: "Asia",
  address: {
    "@type": "PostalAddress",
    addressCountry: "MY",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
