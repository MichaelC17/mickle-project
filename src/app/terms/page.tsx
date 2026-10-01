import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - COMARI",
  description: "COMARI terms of service",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20 px-6">
        <article className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-text-muted mb-12">
            Last updated: August 27, 2026
          </p>

          <div className="space-y-8 text-text-secondary leading-relaxed text-[0.94rem]">
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Overview
              </h2>
              <p>
                COMARI is a marketplace that connects creators for paid
                collaborations. These terms govern your use of comari.app and
                the COMARI platform. By using COMARI, you agree to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Private beta notice
              </h2>
              <p>
                COMARI is currently in private beta. Features may change, and
                the platform is still being developed. We&apos;re building this
                with creator feedback and things may not work perfectly yet.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Accounts
              </h2>
              <ul className="space-y-2 list-none">
                <li className="border-l-2 border-border pl-4">
                  You need a Google account to sign in. We use Google OAuth for
                  authentication.
                </li>
                <li className="border-l-2 border-border pl-4">
                  You&apos;re responsible for your account activity. Don&apos;t
                  share your login credentials.
                </li>
                <li className="border-l-2 border-border pl-4">
                  Provide accurate information. If you&apos;re becoming a host,
                  your YouTube channel must be real and owned by you.
                </li>
                <li className="border-l-2 border-border pl-4">
                  We can suspend or remove accounts that violate these terms or
                  engage in fraud.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                How bookings work
              </h2>
              <ul className="space-y-2 list-none">
                <li className="border-l-2 border-border pl-4">
                  <strong className="text-text-primary">Buyers</strong> browse
                  host profiles, select a package, and pay through Stripe.
                  The host payout is sent after both parties confirm the guest
                  spot was completed.
                </li>
                <li className="border-l-2 border-border pl-4">
                  <strong className="text-text-primary">Hosts</strong> set their
                  own prices, review booking requests, and decide which ones to
                  accept. Hosts are expected to deliver the guest spot as
                  described in their listing.
                </li>
                <li className="border-l-2 border-border pl-4">
                  <strong className="text-text-primary">Completion</strong>{" "}
                  requires confirmation from both the buyer and the host. Once
                  confirmed, the host receives payment minus the platform fee.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Payments and fees
              </h2>
              <ul className="space-y-2 list-none">
                <li className="border-l-2 border-border pl-4">
                  Payments are processed by Stripe. COMARI does not store credit
                  card numbers or bank details.
                </li>
                <li className="border-l-2 border-border pl-4">
                  Buyers pay the listed price with no additional platform fees.
                </li>
                <li className="border-l-2 border-border pl-4">
                  Hosts pay a 15% platform commission on completed bookings.
                  This is deducted before payout.
                </li>
                <li className="border-l-2 border-border pl-4">
                  All prices are in USD.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Refunds
              </h2>
              <ul className="space-y-2 list-none">
                <li className="border-l-2 border-border pl-4">
                  If a host does not deliver the agreed guest spot, the buyer is
                  entitled to a full refund.
                </li>
                <li className="border-l-2 border-border pl-4">
                  Refund requests are reviewed on a case-by-case basis.
                </li>
                <li className="border-l-2 border-border pl-4">
                  Hosts who repeatedly fail to deliver may be removed from the
                  platform.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Content and conduct
              </h2>
              <ul className="space-y-2 list-none">
                <li className="border-l-2 border-border pl-4">
                  Don&apos;t use COMARI for anything illegal, deceptive, or
                  harmful.
                </li>
                <li className="border-l-2 border-border pl-4">
                  Don&apos;t create fake profiles, impersonate other creators,
                  or misrepresent your channel.
                </li>
                <li className="border-l-2 border-border pl-4">
                  Don&apos;t spam hosts with booking requests or abuse the
                  messaging system.
                </li>
                <li className="border-l-2 border-border pl-4">
                  Reviews should be honest and based on your actual experience.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                YouTube API
              </h2>
              <p className="mb-3">
                Parts of COMARI use Google APIs to verify YouTube channels,
                display channel information, and check connected hosts&apos;
                Calendar availability. By connecting your YouTube channel, you
                also agree to{" "}
                <a
                  href="https://www.youtube.com/t/terms"
                  className="text-accent hover:text-accent-hover underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube&apos;s Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="https://policies.google.com/privacy"
                  className="text-accent hover:text-accent-hover underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google&apos;s Privacy Policy
                </a>
                .
              </p>
              <p>
                You can revoke COMARI&apos;s access to your YouTube data at any
                time through your{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  className="text-accent hover:text-accent-hover underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Account permissions
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Liability
              </h2>
              <p className="mb-3">
                COMARI is a platform that connects creators. We are not a party
                to the collaborations themselves.
              </p>
              <ul className="space-y-2 list-none">
                <li className="border-l-2 border-border pl-4">
                  We don&apos;t guarantee any specific subscriber growth, view
                  counts, or outcomes from guest spots.
                </li>
                <li className="border-l-2 border-border pl-4">
                  We are not responsible for the quality of content created
                  during collaborations.
                </li>
                <li className="border-l-2 border-border pl-4">
                  We do our best to verify hosts, but we can&apos;t guarantee
                  every host will deliver a perfect experience.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Changes to these terms
              </h2>
              <p>
                We may update these terms as the platform develops. If we make
                significant changes, we&apos;ll update the date at the top.
                Continued use of COMARI after changes means you accept the
                updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Contact
              </h2>
              <p>
                Questions about these terms? Email{" "}
                <a
                  href="mailto:hello@comari.app"
                  className="text-accent hover:text-accent-hover underline"
                >
                  hello@comari.app
                </a>
                .
              </p>
            </section>
          </div>

          <div className="border-t border-border mt-16 pt-8">
            <Link
              href="/"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              &larr; Back to home
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
