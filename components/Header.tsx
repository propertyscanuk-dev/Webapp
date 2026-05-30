"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "For Sourcers", href: "/sourcers" },
  { label: "For Investors", href: "/investors" },
  { label: "Browse Deals", href: "/deals" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-navy sticky top-0 z-50 border-b border-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            {/* House + magnifying glass icon */}
            <svg viewBox="0 0 40 36" className="w-9 h-8 text-teal" fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
              <path d="M3 15v19h22V15" strokeWidth="2" />
              <path d="M1 15L14 2l13 13" strokeWidth="2" />
              <rect x="9" y="19" width="8" height="8" strokeWidth="1.5" />
              <line x1="13" y1="19" x2="13" y2="27" strokeWidth="1.5" />
              <line x1="9" y1="23" x2="17" y2="23" strokeWidth="1.5" />
              <circle cx="30" cy="22" r="7" strokeWidth="2" />
              <line x1="35.5" y1="27.5" x2="39" y2="31" strokeWidth="2.5" />
            </svg>
            <span className="text-teal font-bold text-xl tracking-tight">
              Property<span className="text-white">Scan</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white transition-colors font-medium"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm bg-teal text-navy font-semibold px-4 py-2 rounded-lg hover:bg-teal-400 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-800 border-t border-navy-700 px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-white py-2 transition-colors font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-navy-700">
            <Link
              href="/login"
              className="text-sm text-center text-white/70 hover:text-white py-2 transition-colors font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm text-center bg-teal text-navy font-semibold px-4 py-2.5 rounded-lg hover:bg-teal-400 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
