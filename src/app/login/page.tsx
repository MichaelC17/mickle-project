"use client"

import { signIn } from "next-auth/react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/context/ThemeContext"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] as const } },
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const { theme } = useTheme()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"signin" | "create">("signin")

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password.")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl })
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* ───── Left Panel — Brand ───── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-accent/20 via-purple-500/10 to-background">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.18, 0.12] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-accent/15 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.16, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/12 blur-[100px]"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-400/5 blur-[80px]" />
        </div>

        <div className="absolute inset-0 grid-bg opacity-30" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="inline-flex">
              <span className="font-display text-2xl text-text-primary tracking-tight">
                COLLAB.
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
              className="font-display text-5xl xl:text-[3.5rem] 2xl:text-6xl text-text-primary leading-[1.08] tracking-tight"
            >
              Where teams
              <br />
              build together.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-text-secondary text-lg max-w-sm leading-relaxed"
            >
              Ship faster with real-time collaboration, async workflows, and
              tools that actually get out of your way.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[
                  "bg-indigo-500",
                  "bg-violet-500",
                  "bg-purple-500",
                  "bg-fuchsia-500",
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-background flex items-center justify-center text-[10px] font-semibold text-white`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm text-text-muted">
                2,400+ teams already collaborating
              </span>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-text-muted text-sm"
          >
            &copy; {new Date().getFullYear()} Collab. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* ───── Right Panel — Form ───── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile logo */}
          <motion.div variants={fadeUp}>
            <Link href="/" className="lg:hidden inline-flex mb-10">
              <span className="font-display text-2xl text-text-primary tracking-tight">
                COLLAB.
              </span>
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeUp} className="mb-8">
            <h2 className="text-2xl font-semibold text-text-primary tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-text-secondary text-[0.94rem]">
              {mode === "signin"
                ? "Sign in to continue to your workspace"
                : "Get started — it takes less than a minute"}
            </p>
          </motion.div>

          {/* Form card */}
          <motion.div
            variants={fadeUp}
            className="glass rounded-xl p-6 space-y-5 shadow-lg shadow-black/5"
          >
            {/* Google OAuth */}
            <button
              onClick={handleGoogleLogin}
              className={`w-full flex items-center justify-center gap-3 font-medium px-4 py-3 rounded-lg border transition-all duration-200 ${
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

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-glass text-text-muted backdrop-blur-sm">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Credentials form */}
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-background border-border text-text-primary placeholder:text-text-muted focus-visible:ring-accent/50"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-background border-border text-text-primary placeholder:text-text-muted focus-visible:ring-accent/50"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium h-11 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === "signin" ? "Sign in" : "Create account"}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {process.env.NODE_ENV === "development" && (
              <p className="text-center text-xs text-text-muted">
                Dev: use any email with password{" "}
                <code className="bg-surface-raised px-1.5 py-0.5 rounded text-text-secondary">
                  demo123
                </code>
              </p>
            )}
          </motion.div>

          {/* Toggle sign-in / create-account */}
          <motion.p variants={fadeUp} className="mt-6 text-center text-sm text-text-secondary">
            {mode === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => { setMode("create"); setError("") }}
                  className="text-accent hover:underline font-medium"
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => { setMode("signin"); setError("") }}
                  className="text-accent hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </motion.p>

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
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
