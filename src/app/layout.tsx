import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { BookingsProvider } from "@/context/BookingsContext";
import { ToastProvider } from "@/context/ToastContext";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "COMARI. – The Marketplace for Creator Collaborations",
    template: "%s | COMARI.",
  },
  description: "A marketplace for creator collaborations — in development. Connect with YouTube and Twitch creators for paid guest spots.",
  keywords: ["creator collaborations", "youtube collaborations", "twitch collaborations", "creator marketplace", "gaming collaborations"],
  authors: [{ name: "COMARI." }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://comari.app",
    siteName: "COMARI.",
    title: "COMARI. – The Marketplace for Creator Collaborations",
    description: "A marketplace for creator collaborations — in development.",
  },
  twitter: {
    card: "summary_large_image",
    title: "COMARI. – The Marketplace for Creator Collaborations",
    description: "A marketplace for creator collaborations — in development.",
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
            <ToastProvider>
              <BookingsProvider>
                {children}
              </BookingsProvider>
            </ToastProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
