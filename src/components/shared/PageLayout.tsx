import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { type ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function PageLayout({
  children,
  showHeader = true,
  showFooter = true,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header />}
      <main className="pt-20 pb-20">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
