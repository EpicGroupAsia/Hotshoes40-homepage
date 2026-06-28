import "./globals.css";

export const metadata = {
  title: "Hotshoes Asia — 40 Years of Moving Brands Forward",
  description:
    "Hotshoes Asia — a bold creative brand activation and events agency. 40 years of turning business objectives into brand experiences that move people, across Asia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
