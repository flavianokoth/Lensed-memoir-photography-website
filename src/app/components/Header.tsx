"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type HeaderTheme = "light" | "dark";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<HeaderTheme>("dark");
  const pathname = usePathname();

  const isLightTheme = theme === "light";

  const navLinkBase =
    "transition-colors duration-200 font-medium " +
    (isLightTheme ? "text-[#05554F] hover:text-[#ff7b00]" : "text-white hover:text-gray-300");

  const scheduleBtnClasses = useMemo(
    () =>
      `px-6 py-2 text-sm font-semibold rounded-lg transition transform hover:scale-105 duration-200 ${
        isLightTheme
          ? "text-[#05554F] border border-[#05554F] bg-white/80 hover:bg-white"
          : "text-white border border-white hover:underline"
      }`,
    [isLightTheme]
  );

  const headerBackground = isLightTheme
    ? "bg-white/95 text-[#05554F] shadow-lg border-b border-gray-100"
    : "bg-white/10 text-white backdrop-blur-md";

  const mobileMenuClasses = isLightTheme
    ? "bg-white text-[#05554F]"
    : "bg-[#05554F] text-white";

  const anchorHref = (hash: string) => `/#${hash}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const topEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (topEntry) {
          const nextTheme =
            (topEntry.target.getAttribute("data-header-theme") as HeaderTheme) ||
            "dark";
          setTheme(nextTheme);
        }
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    const observed = new Set<Element>();
    const watch = () => {
      document
        .querySelectorAll<HTMLElement>("[data-header-theme]")
        .forEach((section) => {
          if (!observed.has(section)) {
            observer.observe(section);
            observed.add(section);
          }
        });
    };

    watch();

    const mutation = new MutationObserver(() => watch());
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBackground}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Logo + Title - Now with consistent background */}
        <Link href="/" className="flex items-center gap-3 bg-inherit">
          <div className="relative flex-shrink-0">
            <Image
              src="/lensed logo.jpg"
              alt="Lensed Memoir logo"
              width={40}
              height={40}
              className="rounded-full object-cover" // optional: rounded logo
              priority
            />
          </div>
          <span
            className={`text-xl font-bold tracking-tight leading-tight ${
              isLightTheme ? "text-[#05554F]" : "text-white"
            }`}
          >
            LENSED&nbsp;MEMOIR
            <br />
            PHOTOGRAPHY
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link href="/" className={navLinkBase}>
              Home
            </Link>
          </li>
          <li>
            <Link href={anchorHref("about")} className={navLinkBase}>
              About
            </Link>
          </li>
          <li>
            <Link href={anchorHref("services")} className={navLinkBase}>
              Services
            </Link>
          </li>
          <li>
            <Link href={anchorHref("gallery")} className={navLinkBase}>
              Gallery
            </Link>
          </li>
          <li>
            <Link href={anchorHref("faqs")} className={navLinkBase}>
              FAQs
            </Link>
          </li>
          <li>
            <Link href={anchorHref("contact")} className={navLinkBase}>
              Contact
            </Link>
          </li>
          <li>
            <Link href="/blog" className={navLinkBase}>
              Blog
            </Link>
          </li>
        </ul>

        {/* Schedule Us button - Desktop */}
        <div className="hidden sm:block">
          <Link
            href={anchorHref("Schedule-Section")}
            className={scheduleBtnClasses}
          >
            Schedule&nbsp;Us
          </Link>
        </div>

        {/* Mobile Book button */}
        <Link
          href={anchorHref("Schedule-Section")}
          className="sm:hidden rounded-lg bg-[#ff7b00] px-4 py-2 text-sm font-semibold text-white shadow-md"
        >
          Book
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md ${
            isLightTheme ? "text-[#05554F]" : "text-white"
          } focus:outline-none`}
          aria-label="Menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className={`md:hidden space-y-4 px-6 py-6 border-t border-white/20 ${mobileMenuClasses}`}>
          <li>
            <Link href="/" onClick={() => setOpen(false)} className="block py-2">
              Home
            </Link>
          </li>
          <li>
            <Link
              href={anchorHref("about")}
              onClick={() => setOpen(false)}
              className="block py-2 hover:opacity-70 transition"
            >
              About&nbsp;Us
            </Link>
          </li>
          <li>
            <Link
              href={anchorHref("services")}
              onClick={() => setOpen(false)}
              className="block py-2 hover:opacity-70 transition"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href={anchorHref("gallery")}
              onClick={() => setOpen(false)}
              className="block py-2 hover:opacity-70 transition"
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              href={anchorHref("faqs")}
              onClick={() => setOpen(false)}
              className="block py-2 hover:opacity-70 transition"
            >
              FAQs
            </Link>
          </li>
          <li>
            <Link
              href={anchorHref("contact")}
              onClick={() => setOpen(false)}
              className="block py-2 hover:opacity-70 transition"
            >
              Contact&nbsp;Us
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              onClick={() => setOpen(false)}
              className="block py-2"
            >
              Blog
            </Link>
          </li>
          <li className="pt-4">
            <Link
              href={anchorHref("Schedule-Section")}
              onClick={() => setOpen(false)}
              className="block rounded-lg bg-[#ff7b00] px-6 py-3 text-center text-lg font-semibold text-white hover:bg-[#ff9433] transition shadow-lg"
            >
              Schedule&nbsp;Us
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}