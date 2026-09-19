"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AccountLinks from "@/components/AccountLinks";
import { nav } from "@/data/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previous || "";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const targets = [document.querySelector("main"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    );

    for (const el of targets) {
      if (open) {
        el.setAttribute("inert", "");
        el.setAttribute("aria-hidden", "true");
      } else {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
    }

    return () => {
      for (const el of targets) {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const solid = scrolled || open || pathname !== "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-all ${
        solid ? "bg-court-deep/95 shadow-lg shadow-black/20 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Kauno teniso klubas nuo 1924"
        >
          <Image
            src="/images/logo.png"
            alt=""
            width={52}
            height={52}
            className="h-12 w-12 rounded-full bg-gold shadow-md"
            priority
            aria-hidden
          />
          <span className="hidden leading-tight sm:block" aria-hidden="true">
            <span className="block font-display text-lg text-white">Kauno teniso klubas</span>
            <span className="block text-xs tracking-[0.22em] text-gold uppercase">nuo 1924</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive(item.href) ? "bg-white/10 text-gold" : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
              {item.children ? (
                <div className="absolute left-0 top-full z-10 hidden pt-2 group-hover:block group-focus-within:block">
                  <div className="min-w-52 rounded-2xl border border-white/10 bg-court-deep p-2 shadow-xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <AccountLinks />
          <Link
            href="/naryste"
            className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-court-deep hover:bg-gold-deep"
          >
            Tapti nariu
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Uždaryti meniu" : "Atidaryti meniu"}
            onClick={() => setOpen((value) => !value)}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              {open ? (
                <path stroke="currentColor" strokeWidth="2" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path stroke="currentColor" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-white/10 bg-court-deep px-4 py-4 lg:hidden"
        >
          <div className="grid gap-2 pb-8">
            {nav.map((item) => (
              <div key={item.href}>
                <Link href={item.href} className="block rounded-xl px-3 py-2 text-white">
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="ml-3 grid">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="rounded-lg px-3 py-1.5 text-sm text-white/70"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <AccountLinks mobile />
          </div>
        </div>
      ) : null}
    </header>
  );
}
