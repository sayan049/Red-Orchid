"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { SoundToggle } from "@/components/ui/SoundToggle"
import { LiveTime } from "@/components/ui/LiveTime"
import { sound } from "@/lib/sound"

// Navigation links tailored for Red Orchid Films
const navigationLinks = [
  { href: "/", label: "Home", key: "home" },
  {
    label: "Works",
    key: "works",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/#trending",
        label: "Spotlight Cinema",
        description: "Award-winning short films & premier narrative direction.",
        key: "works",
      },
      {
        href: "/#works",
        label: "Selected Filmography",
        description: "Arri Alexa 35mm productions, kinetic visuals & brand worlds.",
        key: "works",
      },
      {
        href: "/#services",
        label: "Production Archive",
        description: "Behind-the-scenes cinematography and master reel portfolio.",
        key: "services",
      },
    ],
  },
  {
    label: "Services",
    key: "services",
    submenu: true,
    type: "simple",
    items: [
      { href: "/#services", label: "Cinema & Narrative Direction", key: "services" },
      { href: "/#services", label: "Commercial Production", key: "services" },
      { href: "/#services", label: "9:16 Kinetic Reels", key: "services" },
      { href: "/#services", label: "Color Grading & Post-Production", key: "services" },
    ],
  },
  { href: "/#faq", label: "FAQ", key: "faq" },
  { href: "/contact", label: "Contact", key: "contact" },
]

export function NavigationMenu4() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<string>("home")
  const pathname = usePathname()
  const router = useRouter()

  const isScrolledRef = React.useRef(false)
  const activeSectionRef = React.useRef("home")

  // Track scroll position for floating bar style with rAF throttling
  React.useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const nextScrolled = window.scrollY > 40
          if (nextScrolled !== isScrolledRef.current) {
            isScrolledRef.current = nextScrolled
            setIsScrolled(nextScrolled)
          }
          ticking = false
        })
        ticking = true
      }
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Dynamic Scroll Spy for Navbar Focus on Homepage & Cross-Page Route tracking
  React.useEffect(() => {
    if (pathname === "/contact") {
      activeSectionRef.current = "contact"
      setActiveSection("contact")
      return
    }

    if (pathname?.startsWith("/work")) {
      activeSectionRef.current = "works"
      setActiveSection("works")
      return
    }

    if (pathname !== "/") {
      activeSectionRef.current = ""
      setActiveSection("")
      return
    }

    // On homepage, observe sections dynamically with rAF throttling to eliminate layout thrashing
    let ticking = false
    const sections = [
      { id: "home", key: "home" },
      { id: "trending", key: "works" },
      { id: "works", key: "works" },
      { id: "services", key: "services" },
      { id: "faq", key: "faq" },
      { id: "contact", key: "contact" },
    ]

    const handleScrollSpy = () => {
      const scrollBottom = window.innerHeight + window.scrollY
      const documentHeight = document.documentElement.scrollHeight
      if (documentHeight - scrollBottom < 120) {
        if (activeSectionRef.current !== "contact") {
          activeSectionRef.current = "contact"
          setActiveSection("contact")
        }
        return
      }

      const scrollY = window.scrollY + 220

      let current = "home"
      for (const sec of sections) {
        const el = document.getElementById(sec.id)
        if (el && scrollY >= el.offsetTop) {
          current = sec.key
        }
      }

      if (current !== activeSectionRef.current) {
        activeSectionRef.current = current
        setActiveSection(current)
      }
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScrollSpy()
          ticking = false
        })
        ticking = true
      }
    }

    handleScrollSpy()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [pathname])

  // Unified click handler for navigation links (smooth in-page or reliable cross-page)
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    key?: string
  ) => {
    sound.playClick()
    setIsOpen(false)

    if (key) {
      setActiveSection(key)
    }

    const hasHash = href.includes("#")
    const hash = hasHash ? `#${href.split("#")[1]}` : ""

    if (hasHash) {
      if (pathname === "/") {
        // Already on home page: smooth scroll to element without jumping
        e.preventDefault()
        const id = hash.replace(/^#/, "")
        const target = document.getElementById(id) || document.querySelector(hash)
        if (target) {
          const y = target.getBoundingClientRect().top + window.scrollY - 80
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" })
        }
      } else {
        // On another page (e.g. /contact): prevent jump, store target hash, and push via Next router
        e.preventDefault()
        try {
          sessionStorage.setItem("target_scroll_hash", hash)
        } catch {
          // ignore
        }
        router.push(href)
      }
    } else if (href === "/") {
      if (pathname === "/") {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-40 flex justify-center pointer-events-none transition-all duration-500 ease-out",
        isScrolled
          ? "top-3 sm:top-4 px-3 sm:px-6"
          : "top-0 px-4 sm:px-8 pt-2 sm:pt-4"
      )}
    >
      {/* Floating container: Seamless blending at landing page top, floating border-box with proper radius when scrolled */}
      <div
        className={cn(
          "pointer-events-auto flex items-center justify-between w-full transition-all duration-500 ease-out",
          isScrolled
            ? "max-w-6xl rounded-2xl sm:rounded-full border border-white/15 bg-black/75 backdrop-blur-xl px-4 sm:px-6 py-2 sm:py-2.5"
            : "max-w-7xl rounded-none border border-transparent bg-transparent backdrop-blur-none px-2 sm:px-4 py-3 sm:py-4"
        )}
      >
        {/* Left: Brand Logo & Mobile Popover trigger */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile menu trigger with animated SVG icon */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                className="group size-9 md:hidden rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/15 active:scale-95 flex items-center justify-center shrink-0"
                variant="ghost"
                size="icon"
                onClick={() => sound.playClick()}
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="pointer-events-none"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-72 p-2 md:hidden bg-[#0c0a0a]/95 border border-white/15 backdrop-blur-2xl text-white rounded-2xl"
            >
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 w-full">
                  {navigationLinks.map((link, index) => {
                    const isLinkActive = link.key === activeSection

                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        {link.submenu ? (
                          <>
                            <div className="font-mono-code text-orchid px-2.5 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-widest flex items-center justify-between">
                              <span>{"// " + link.label}</span>
                              {isLinkActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
                              )}
                            </div>
                            <ul className="space-y-0.5 pb-1">
                              {link.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={item.href}
                                      onClick={(e) => handleNavClick(e, item.href, item.key)}
                                      className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-mono-code uppercase tracking-wider text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                      <span>{item.label}</span>
                                      <ArrowRight className="h-3 w-3 text-white/30" />
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <NavigationMenuLink asChild>
                            <Link
                              href={link.href || "#"}
                              onClick={(e) => handleNavClick(e, link.href || "#", link.key)}
                              className={cn(
                                "flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors",
                                isLinkActive
                                  ? "bg-white/15 text-white font-semibold border border-white/25"
                                  : "text-white/80 hover:bg-white/10 hover:text-white border border-transparent"
                              )}
                            >
                              <span>{link.label}</span>
                              {isLinkActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
                              )}
                            </Link>
                          </NavigationMenuLink>
                        )}

                        {/* Separator between menu sections */}
                        {index < navigationLinks.length - 1 &&
                          ((!link.submenu && navigationLinks[index + 1].submenu) ||
                            (link.submenu && !navigationLinks[index + 1].submenu) ||
                            (link.submenu &&
                              navigationLinks[index + 1].submenu &&
                              link.type !== navigationLinks[index + 1].type)) && (
                            <div
                              role="separator"
                              aria-orientation="horizontal"
                              className="bg-white/10 -mx-1 my-1.5 h-px w-full"
                            />
                          )}
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>

              {/* Mobile Drawer Footer Controls */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between px-2">
                <span className="font-mono-code text-[10px] text-white/50 uppercase tracking-widest">
                  AUDIO
                </span>
                <SoundToggle />
              </div>
            </PopoverContent>
          </Popover>

          {/* Red Orchid Brand Logo */}
          <BrandLogo />
        </div>

        {/* Center: Desktop Navigation menu */}
        <div className="hidden md:flex items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-1">
              {navigationLinks.map((link, index) => {
                const isActive = link.key === activeSection

                return (
                  <NavigationMenuItem key={index}>
                    {link.submenu ? (
                      <>
                        <NavigationMenuTrigger
                          onClick={() => sound.playClick()}
                          className={cn(
                            "transition-all duration-300",
                            isActive
                              ? "text-white bg-white/15 border border-white/25 font-semibold"
                              : "text-white/70 hover:bg-white/10 hover:text-white border border-transparent"
                          )}
                        >
                          {link.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul
                            className={cn(
                              "grid w-[420px] gap-2 p-3 md:w-[480px] md:grid-cols-2 lg:w-[540px]",
                              link.type === "description" && "md:grid-cols-1"
                            )}
                          >
                            {link.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href, item.key)}
                                    className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group"
                                  >
                                    {/* Description preview */}
                                    {link.type === "description" && "description" in item && (
                                      <>
                                        <div className="text-xs font-mono-code uppercase tracking-wider text-white font-medium leading-none flex items-center justify-between">
                                          <span>{item.label}</span>
                                          <ArrowRight className="h-3 w-3 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="line-clamp-2 text-xs leading-relaxed text-white/60 pt-1 font-sans-ui">
                                          {item.description}
                                        </p>
                                      </>
                                    )}

                                    {/* Simple preview */}
                                    {link.type === "simple" && (
                                      <div className="text-xs font-mono-code uppercase tracking-wider text-white/80 hover:text-white transition-colors leading-none flex items-center justify-between py-1">
                                        <span>{item.label}</span>
                                        <span className="text-[10px] text-orchid opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                                      </div>
                                    )}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={link.href || "#"}
                          onClick={(e) => handleNavClick(e, link.href || "#", link.key)}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "leading-none transition-all duration-300",
                            isActive
                              ? "text-white bg-white/15 border border-white/25 font-semibold"
                              : "text-white/70 hover:bg-white/10 hover:text-white border border-transparent"
                          )}
                        >
                          <span className="leading-none">{link.label}</span>
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>

        {/* Right side: LiveTime and SoundToggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden xl:flex items-center">
            <LiveTime />
          </div>

          <SoundToggle />
        </div>
      </div>
    </header>
  )
}

export default NavigationMenu4
