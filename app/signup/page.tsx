"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Moon } from "lucide-react";
import { ApiError, setDisplayName } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { AuthLayout } from "@/components/auth/auth-layout";

const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
const strengthColors = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-emerald-500",
];

function passwordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  return score;
}

function messageForError(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Signup failed";
  }
  if (error.status === 409) {
    return "Email already exists.";
  }
  return error.message;
}

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = passwordStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

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
          <h1 className="text-3xl font-semibold text-slate-900">
            Create Your Account
          </h1>
          <p className="mt-2 text-slate-600">Start your memorization journey today.</p>
        </div>

        <form
          className="space-y-5"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);

            if (!passwordsMatch) {
              setError("Passwords do not match.");
              return;
            }
            if (!termsAccepted) {
              setError("Accept terms to continue.");
              return;
            }

            setLoading(true);
            try {
              await signup({
                email: email.trim().toLowerCase(),
                password,
              });
              setDisplayName(name.trim());
              router.replace("/assessment");
            } catch (err) {
              setError(messageForError(err));
            } finally {
              setLoading(false);
            }
          }}
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Display Name (local)
            </label>
            <input
              value={name}
              placeholder="Enter your display name"
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
            />
          </div>

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
                placeholder="Create a strong password"
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
            {password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={`strength-${index}`}
                      className={`h-1.5 flex-1 rounded-full ${
                        index < strength ? strengthColors[strength] : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-600">{strengthLabels[strength]}</p>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              placeholder="Confirm your password"
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
            />
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-xs text-rose-700">Passwords do not match</p>
            )}
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
            />
            I agree to the{" "}
            <Link href="/terms" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </label>

          {error && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !termsAccepted || !passwordsMatch}
            className="w-full rounded-xl gradient-primary px-4 py-3 text-base font-semibold text-white shadow-glow disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
