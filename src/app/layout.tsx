import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CollabBook – The Marketplace for Creator Collaborations",
    template: "%s | CollabBook",
  },
  description: "Book verified YouTube, TikTok, Instagram, and Twitch creators for paid collaborations. Browse creators, set pricing, coordinate logistics, and track results.",
  keywords: ["creator collaborations", "youtube collaborations", "tiktok collaborations", "creator marketplace", "influencer collaborations"],
  authors: [{ name: "CollabBook" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://collabbook.io",
    siteName: "CollabBook",
    title: "CollabBook – The Marketplace for Creator Collaborations",
    description: "Book verified YouTube, TikTok, Instagram, and Twitch creators for paid collaborations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CollabBook – The Marketplace for Creator Collaborations",
    description: "Book verified YouTube, TikTok, Instagram, and Twitch creators for paid collaborations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
