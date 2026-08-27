import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - COMARI",
  description: "COMARI privacy policy",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20 px-6">
        <article className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-text-muted mb-12">
            Last updated: August 27, 2026
          </p>

          <div className="space-y-8 text-text-secondary leading-relaxed text-[0.94rem]">
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                What this policy covers
              </h2>
              <p>
                This policy explains what data COMARI collects, why we collect
                it, and how we handle it. COMARI is a marketplace that connects
                creators for paid collaborations (guest spots). This policy
                applies to anyone who visits comari.app or uses the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                What we collect
              </h2>
              <p className="mb-3">
                We collect data in a few ways depending on how you use the
                platform:
              </p>
              <ul className="space-y-3 list-none">
                <li className="border-l-2 border-border pl-4">
                  <strong className="text-text-primary">Account info.</strong>{" "}
                  When you sign in with Google, we receive your name, email
                  address, and profile picture from Google. We use this to
                  create and manage your account.
                </li>
                <li className="border-l-2 border-border pl-4">
                  <strong className="text-text-primary">
                    YouTube channel data.
                  </strong>{" "}
                  If you connect your YouTube channel (to become a host or
                  verify your channel), we access your channel name, subscriber
                  count, video count, view count, channel thumbnail, and custom
                  URL through the YouTube Data API. We use this data to display
                  your host profile and verify channel ownership. We do not
                  access your private videos, comments, or analytics beyond what
                  is publicly available through the API.
                </li>
                <li className="border-l-2 border-border pl-4">
                  <strong className="text-text-primary">Payment info.</strong>{" "}
                  Payments are processed through Stripe. We do not store your
                  credit card number or bank details. Stripe handles that
                  directly. We store references to Stripe transactions
                  (session IDs, payment intent IDs) to track bookings.
                </li>
                <li className="border-l-2 border-border pl-4">
                  <strong className="text-text-primary">
                    Messages and bookings.
                  </strong>{" "}
                  Messages you send through the platform and booking details
                  (host, package, amount, status) are stored to facilitate
                  collaborations.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                How we use your data
              </h2>
              <ul className="space-y-2 list-none">
                <li className="border-l-2 border-border pl-4">
                  To create and maintain your account
                </li>
                <li className="border-l-2 border-border pl-4">
                  To display host profiles with accurate channel information
                </li>
                <li className="border-l-2 border-border pl-4">
                  To process bookings and payments through Stripe
                </li>
                <li className="border-l-2 border-border pl-4">
                  To send notifications about booking status, messages, and
                  scheduling
                </li>
                <li className="border-l-2 border-border pl-4">
                  To track growth metrics after guest spots (subscriber/view
                  changes), when you&apos;ve connected your YouTube channel
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                YouTube API Services
              </h2>
              <p className="mb-3">
                COMARI&apos;s use of information received from Google APIs
                adheres to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  className="text-accent hover:text-accent-hover underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
              <p className="mb-3">Specifically:</p>
              <ul className="space-y-2 list-none">
                <li className="border-l-2 border-border pl-4">
                  We only request the YouTube scopes necessary for the features
                  you use (channel verification and profile display).
                </li>
                <li className="border-l-2 border-border pl-4">
                  We do not sell, lease, or share YouTube data with third
                  parties for advertising or unrelated purposes.
                </li>
                <li className="border-l-2 border-border pl-4">
                  We do not use YouTube data for surveillance, tracking users
                  across other services, or building advertising profiles.
                </li>
                <li className="border-l-2 border-border pl-4">
                  You can revoke COMARI&apos;s access to your YouTube data at
                  any time through your{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    className="text-accent hover:text-accent-hover underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Account permissions
                  </a>
                  .
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Data storage and security
              </h2>
              <p>
                Your data is stored in a PostgreSQL database hosted on Supabase
                (AWS infrastructure). Connections are encrypted. Passwords (for
                email/password accounts) are not currently implemented in
                production; authentication is handled through Google OAuth.
                Payment data is handled entirely by Stripe and never touches our
                servers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Data sharing
              </h2>
              <p>
                We share data with the following third-party services, and only
                what&apos;s necessary for the platform to work:
              </p>
              <ul className="space-y-2 list-none mt-3">
                <li className="border-l-2 border-border pl-4">
                  <strong className="text-text-primary">Stripe</strong> &mdash;
                  payment processing
                </li>
                <li className="border-l-2 border-border pl-4">
                  <strong className="text-text-primary">Google</strong> &mdash;
                  authentication and YouTube API
                </li>
                <li className="border-l-2 border-border pl-4">
                  <strong className="text-text-primary">Supabase</strong>{" "}
                  &mdash; database hosting
                </li>
                <li className="border-l-2 border-border pl-4">
                  <strong className="text-text-primary">Vercel</strong> &mdash;
                  application hosting
                </li>
                <li className="border-l-2 border-border pl-4">
                  <strong className="text-text-primary">Resend</strong> &mdash;
                  email notifications
                </li>
              </ul>
              <p className="mt-3">
                We do not sell your data to anyone. We do not share data with
                advertisers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Your rights
              </h2>
              <p>You can:</p>
              <ul className="space-y-2 list-none mt-3">
                <li className="border-l-2 border-border pl-4">
                  Request a copy of your data by emailing us
                </li>
                <li className="border-l-2 border-border pl-4">
                  Request deletion of your account and associated data
                </li>
                <li className="border-l-2 border-border pl-4">
                  Revoke YouTube/Google access through your Google Account
                  settings
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Cookies
              </h2>
              <p>
                We use cookies for authentication (keeping you logged in) and
                theme preferences. We do not use tracking cookies or third-party
                analytics cookies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Changes to this policy
              </h2>
              <p>
                If we make significant changes to this policy, we&apos;ll update
                the date at the top and post the new version here. We won&apos;t
                reduce your rights under this policy without your consent.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Contact
              </h2>
              <p>
                Questions about this policy? Email{" "}
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
