"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { LiveTime } from "@/components/ui/LiveTime";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { sound } from "@/lib/sound";

const NAV_LINKS = [
  { label: "Works", href: "/#works" },
  { label: "Gallery", href: "/gallery" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    sound.playClick();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "border-b border-white/5 bg-black/85 py-3 sm:py-3.5 backdrop-blur-xl"
            : "bg-gradient-to-b from-black/85 via-black/35 to-transparent py-4 sm:py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 md:px-10 lg:px-14">
          {/* Brand mark */}
          <BrandLogo />

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center gap-7 lg:gap-9 md:flex"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === pathname ||
                (link.href.startsWith("/#") && pathname === "/");

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => sound.playClick()}
                  data-cursor="NAV"
                  className={`group relative text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-300 hover:text-white py-1 ${
                    isActive ? "text-bone" : "text-white/60"
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-orchid transition-all duration-300 ease-out group-hover:w-full ${
                      isActive ? "w-3/5" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right utility items: Sound toggle + Live clock + Mobile trigger */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="hidden xl:block">
              <LiveTime />
            </div>

            <SoundToggle />

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:border-white/30 hover:text-white md:hidden focus-visible:outline-orchid"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-30 flex flex-col justify-between bg-black/95 px-6 sm:px-10 pt-28 pb-10 backdrop-blur-2xl transition-all duration-500 ease-in-out md:hidden overflow-y-auto ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-4"
        }`}
      >
        <nav aria-label="Mobile Navigation" className="flex flex-col gap-5 sm:gap-6 my-auto">
          <span className="font-mono-code text-[11px] font-medium tracking-widest text-orchid uppercase">
            // INDEX DIRECTORY
          </span>
          {NAV_LINKS.map((link, idx) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => {
                sound.playClick();
                setIsMobileMenuOpen(false);
              }}
              className="group flex items-center justify-between border-b border-white/10 pb-4 min-h-[48px]"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono-code text-xs text-white/40">
                  0{idx + 1}
                </span>
                <span className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-bone uppercase transition-colors group-hover:text-orchid">
                  {link.label}
                </span>
              </div>
              <ArrowUpRight
                className="h-5 w-5 text-white/40 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-orchid"
                strokeWidth={1.5}
              />
            </Link>
          ))}
        </nav>

        {/* Mobile footer info */}
        <div className="space-y-4 border-t border-white/10 pt-6 mt-8">
          <LiveTime showSeconds={false} />
          <p className="font-sans-ui text-xs text-white/50">
            Kolkata • Mumbai • Worldwide
          </p>
          <p className="font-mono-code text-[10px] text-white/30">
            &copy; {new Date().getFullYear()} Red Orchid Films. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
