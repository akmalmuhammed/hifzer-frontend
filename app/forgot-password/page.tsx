"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold text-slate-900">Forgot Password</h1>
        <p className="mt-2 text-slate-600">
          Reset flow is not enabled in this phase. Use your active session or
          contact support.
        </p>
        <Link
          href="/sign-in"
          className="mt-5 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700"
        >
          Back to login
        </Link>
      </motion.div>
    </AuthLayout>
  );
}
