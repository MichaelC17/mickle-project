import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { BookingsProvider } from "@/context/BookingsContext";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "COLLAB. – The Marketplace for Creator Collaborations",
    template: "%s | COLLAB.",
  },
  description: "Book verified YouTube and Twitch creators for paid collaborations. Browse creators, set pricing, coordinate logistics, and track results.",
  keywords: ["creator collaborations", "youtube collaborations", "twitch collaborations", "creator marketplace", "gaming collaborations"],
  authors: [{ name: "COLLAB." }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://collab.io",
    siteName: "COLLAB.",
    title: "COLLAB. – The Marketplace for Creator Collaborations",
    description: "Book verified YouTube and Twitch creators for paid collaborations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "COLLAB. – The Marketplace for Creator Collaborations",
    description: "Book verified YouTube and Twitch creators for paid collaborations.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <SessionProvider>
          <ThemeProvider>
            <BookingsProvider>
              {children}
            </BookingsProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
