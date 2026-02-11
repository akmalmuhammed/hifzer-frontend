import Link from "next/link";
import { Globe, Heart, Moon } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/60 py-12">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Moon size={22} className="text-teal-700" />
              <span className="text-xl font-semibold text-slate-900">Hifz OS</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              A retention-first operating system for Qur&apos;an memorization.
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="mb-4 text-sm font-semibold text-slate-900">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} className="text-sm text-slate-600 hover:text-slate-900">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-slate-600 hover:text-slate-900">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 md:flex-row">
          <p className="flex items-center gap-1 text-xs text-slate-600">
            (c) 2026 Hifz OS. Made with{" "}
            <Heart size={12} className="text-rose-600" /> for the Ummah.
          </p>
          <p className="flex items-center gap-1 text-xs text-slate-600">
            <Globe size={12} /> English
          </p>
        </div>
      </div>
    </footer>
  );
}
