"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Lensed Memoir logo"
            width={36}
            height={36}
          />
          <span className="text-xl font-bold tracking-tight text-white">
            LENSED&nbsp;MEMOIR
            <br />
            PHOTOGRAPHY
          </span>
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 text-white">
          <li>
            <Link className="hover:text-gray-700" href="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-700" href="#about">
              About&nbsp;Us
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-700" href="#services">
              Services
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-700" href="#gallery">
              Gallery
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-700" href="#contact">
              Contact&nbsp;Us
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-700" href="/blog">
              Blog
            </Link>
          </li>
        </ul>

        {/* Schedule Us button*/}
        <div className="hidden sm:block">
          <Link
            href="/schedule"
            className="px-6 py-2 text-sm font-semibold text-white border border-white rounded-lg hover:underline transition transform hover:scale-105 duration-200"
          >
            Schedule&nbsp;Us
          </Link>
        </div>

        {/* Mobile Book button */}
        <Link
          href="/schedule"
          className="sm:hidden rounded-lg bg-[#ff7b00] px-3 py-1.5 text-sm font-semibold text-white "
        >
          Book
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden ml-2 inline-flex items-center justify-center p-2 text-white focus:outline-none"
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
        <ul className="md:hidden space-y-4 px-6 pb-4 text-white bg-[#05554F] ">
          <li>
            <Link  className="hover:text-gray-700" href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-700"  href="#about" onClick={() => setOpen(false)}>
              About&nbsp;Us
            </Link>
          </li>
          <li>
            <Link  className="hover:text-gray-700"  href="#services" onClick={() => setOpen(false)}>
              Services
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-700"  href="#gallery" onClick={() => setOpen(false)}>
              Gallery
            </Link>
          </li>
          <li>
            <Link  className="hover:text-gray-700"  href="#contact" onClick={() => setOpen(false)}>
              Contact&nbsp;Us
            </Link>
          </li>
          <li>
            <Link   className="hover:text-gray-700" href="/blog" onClick={() => setOpen(false)}>
              Blog
            </Link>
          </li>
          <li>
            <Link
              href="/schedule"
              className="block rounded-lg bg-[#ff7b00] px-4 py-2 text-center font-semibold text-white hover:bg-[#ff9433] transition"
              onClick={() => setOpen(false)}
            >
              Schedule&nbsp;Us
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
