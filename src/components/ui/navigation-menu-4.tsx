"use client"

import * as React from "react"
import Link from "next/link"
import { Clapperboard, Camera, MapPin, ArrowRight } from "lucide-react"

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

// Navigation links tailored for Red Orchid Films (strictly no gallery option)
const navigationLinks = [
  { href: "/", label: "Home" },
  {
    label: "Works",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/#trending",
        label: "Spotlight Cinema",
        description: "Award-winning short films & premier narrative direction.",
      },
      {
        href: "/#works",
        label: "Selected Filmography",
        description: "Arri Alexa 35mm productions, kinetic visuals & brand worlds.",
      },
      {
        href: "/#services",
        label: "Production Archive",
        description: "Behind-the-scenes cinematography and master reel portfolio.",
      },
    ],
  },
  {
    label: "Services",
    submenu: true,
    type: "simple",
    items: [
      { href: "/#services", label: "Cinema & Narrative Direction" },
      { href: "/#services", label: "Commercial Production" },
      { href: "/#services", label: "9:16 Kinetic Reels" },
      { href: "/#services", label: "Color Grading & Post-Production" },
    ],
  },
  {
    label: "Atelier",
    submenu: true,
    type: "icon",
    items: [
      { href: "/#about", label: "Artistic Philosophy", icon: "Clapperboard" },
      { href: "/contact", label: "Kolkata & Mumbai Studio", icon: "MapPin" },
      { href: "/#services", label: "Equipment & Technical Scope", icon: "Camera" },
    ],
  },
  { href: "/contact", label: "Contact" },
]

export function NavigationMenu4() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
            ? "max-w-6xl rounded-2xl sm:rounded-full border border-white/15 bg-black/75 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.65)] px-4 sm:px-6 py-2 sm:py-2.5"
            : "max-w-7xl rounded-none border border-transparent bg-transparent shadow-none backdrop-blur-none px-2 sm:px-4 py-3 sm:py-4"
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
              className="w-72 p-2 md:hidden bg-[#0c0a0a]/95 border border-white/15 backdrop-blur-2xl text-white shadow-2xl rounded-2xl"
            >
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 w-full">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      {link.submenu ? (
                        <>
                          <div className="font-mono-code text-orchid px-2.5 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-widest">
                            {"// " + link.label}
                          </div>
                          <ul className="space-y-0.5 pb-1">
                            {link.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={item.href}
                                    onClick={() => {
                                      sound.playClick()
                                      setIsOpen(false)
                                    }}
                                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-sans-ui text-white/80 hover:bg-white/10 hover:text-white transition-colors"
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
                            onClick={() => {
                              sound.playClick()
                              setIsOpen(false)
                            }}
                            className="block rounded-lg px-2.5 py-2 text-xs font-mono-code uppercase tracking-wider text-bone hover:bg-white/10 hover:text-white transition-colors"
                          >
                            {link.label}
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
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>

          {/* Red Orchid Brand Logo */}
          <BrandLogo />
        </div>

        {/* Center: Desktop Navigation menu */}
        <div className="hidden md:flex items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-1">
              {navigationLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  {link.submenu ? (
                    <>
                      <NavigationMenuTrigger
                        onClick={() => sound.playClick()}
                        className="h-9 inline-flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 bg-transparent px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider transition-colors rounded-md"
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
                                  onClick={() => sound.playClick()}
                                  className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group"
                                >
                                  {/* Icon preview */}
                                  {link.type === "icon" && "icon" in item && (
                                    <div className="flex items-center gap-2.5">
                                      {item.icon === "Clapperboard" && (
                                        <Clapperboard
                                          size={16}
                                          className="text-orchid shrink-0 transition-transform group-hover:scale-110"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {item.icon === "Camera" && (
                                        <Camera
                                          size={16}
                                          className="text-orchid shrink-0 transition-transform group-hover:scale-110"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {item.icon === "MapPin" && (
                                        <MapPin
                                          size={16}
                                          className="text-orchid shrink-0 transition-transform group-hover:scale-110"
                                          aria-hidden="true"
                                        />
                                      )}
                                      <div className="text-xs font-mono-code uppercase tracking-wider text-white font-medium leading-none">
                                        {item.label}
                                      </div>
                                    </div>
                                  )}

                                  {/* Description preview */}
                                  {link.type === "description" && "description" in item && (
                                    <>
                                      <div className="text-xs font-mono-code uppercase tracking-wider text-white font-semibold leading-none flex items-center justify-between">
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
                        onClick={() => sound.playClick()}
                        className="h-9 inline-flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 py-1.5 px-3 rounded-md text-xs font-mono-code uppercase tracking-wider transition-colors"
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>

        {/* Right side: LiveTime and SoundToggle maintaining perfect matching gap like other navbar options */}
        <div className="flex items-center gap-1">
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
