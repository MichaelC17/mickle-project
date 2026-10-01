"use client"

import { signIn } from "next-auth/react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/context/ThemeContext"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] as const } },
}

function LoginContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const { theme } = useTheme()

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl })
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* ───── Left Panel — Brand ───── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-surface border-r border-border">
        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="inline-flex">
              <span className="font-bold text-2xl text-text-primary tracking-tight">
                COMARI.
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="space-y-8"
          >
            <motion.h1
              variants={fadeUp}
              className="font-bold text-5xl xl:text-[3.5rem] 2xl:text-6xl text-text-primary leading-[1.08] tracking-tight"
            >
              Book guest spots on
              <br />
              bigger channels.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-text-secondary text-lg max-w-sm leading-relaxed"
            >
              Creators pay to appear on bigger channels. Pick a host,
              book a guest spot, and their subscribers see your content.
            </motion.p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-text-muted text-sm"
          >
            &copy; {new Date().getFullYear()} COMARI. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* ───── Right Panel — Form ───── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 relative">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile logo */}
          <motion.div variants={fadeUp}>
            <Link href="/" className="lg:hidden inline-flex mb-10">
              <span className="font-bold text-2xl text-text-primary tracking-tight">
                COMARI.
              </span>
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeUp} className="mb-8">
            <h2 className="text-2xl font-semibold text-text-primary tracking-tight">
              Sign in to COMARI
            </h2>
            <p className="mt-2 text-text-secondary text-[0.94rem]">
              Use your Google account to continue or create a profile.
            </p>
          </motion.div>

          {/* Early access disclaimer */}
          <motion.div
            variants={fadeUp}
            className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 px-4 py-3.5 mb-2"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/90 leading-relaxed">
              <span className="font-semibold text-amber-400">Private beta.</span>{" "}
              Access is limited to invited creators while we test profiles,
              scheduling, and bookings. To see how the process works,{" "}
              <Link href="/how-it-works" className="text-amber-400 underline hover:text-amber-300 transition-colors">
                click here
              </Link>.
            </p>
          </motion.div>

          {/* Form card */}
          <motion.div
            variants={fadeUp}
            className="border border-border bg-surface p-6 space-y-5"
          >
            {/* Google OAuth */}
            <button
              onClick={handleGoogleLogin}
              className={`w-full flex items-center justify-center gap-3 font-medium px-4 py-3 rounded-sm border transition-all duration-200 ${
                theme === "dark"
                  ? "bg-[#131314] text-white border-[#2d2d2f] hover:bg-[#1e1e20] hover:border-[#3a3a3f]"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-xs text-text-muted leading-relaxed">
              Google sign-in keeps each creator profile tied to a verified account.
            </p>
          </motion.div>

          {/* Legal */}
          <motion.p variants={fadeUp} className="mt-4 text-center text-xs text-text-muted leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-text-secondary transition-colors">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-text-secondary transition-colors">
              Privacy Policy
            </Link>
            .
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
