"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface MobileNavProps {
  activePage: "before-you-start" | "inspiration" | "how-it-works";
}

const links = [
  { href: "/before-you-start", label: "Before You Start", key: "before-you-start" },
  { href: "/inspiration", label: "Inspiration", key: "inspiration" },
  { href: "/how-it-works", label: "How it works", key: "how-it-works" },
];

export default function MobileNav({ activePage }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#9DF542] transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} className="text-[#111]" />
      </button>

      {/* Overlay + Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
              onClick={() => setOpen(false)}
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[75vw] max-w-[320px] bg-white z-[100] shadow-2xl flex flex-col rounded-l-[2rem]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-gray-100">
                <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col gap-2 px-4 pt-6">
                {links.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[17px] font-bold transition-colors ${
                      activePage === link.key
                        ? "bg-[#9DF542] text-[#111]"
                        : "text-[#2d3227] hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                    {activePage === link.key && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-[#111]" />
                    )}
                  </Link>
                ))}
              </nav>

              {/* CTA Buttons */}
              <div className="mt-auto px-4 pb-10 flex flex-col gap-3">
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="w-full text-center py-4 rounded-2xl bg-[#111] text-white font-bold text-[16px] hover:bg-black transition-colors"
                >
                  Explore Catalog
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="w-full text-center py-4 rounded-2xl bg-[#9DF542] text-[#111] font-bold text-[16px] hover:opacity-90 transition-colors"
                >
                  Sign up Free
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
