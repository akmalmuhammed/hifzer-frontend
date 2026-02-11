"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Moon } from "lucide-react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { AuthLayout } from "@/components/auth/auth-layout";

function messageForError(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Login failed";
  }
  if (error.status === 401) {
    return "Invalid email or password.";
  }
  if (error.status === 429) {
    return `Rate limited. Retry in ${error.retryAfterSeconds ?? 30}s.`;
  }
  return error.message;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [redirectTo, setRedirectTo] = useState("/today");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next) {
      setRedirectTo(next);
    }
  }, []);

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 lg:hidden"
          >
            <Moon size={16} /> Hifz OS
          </Link>
          <h1 className="text-3xl font-semibold text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-slate-600">
            Continue your memorization journey.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            setError(null);
            try {
              await login({
                email: email.trim().toLowerCase(),
                password,
              });
              router.replace(redirectTo);
            } catch (err) {
              setError(messageForError(err));
            } finally {
              setLoading(false);
            }
          }}
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              placeholder="you@example.com"
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                placeholder="Enter your password"
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm font-medium underline">
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl gradient-primary px-4 py-3 text-base font-semibold text-white shadow-glow disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
