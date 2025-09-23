"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useFocusTrap, KeyboardNavigation } from "@/lib/accessibility"

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  // { name: "Blog", href: "/blog" }, // Temporarily disabled - feature coming soon
  { name: "Contact", href: "/contact" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const pathname = usePathname()
  const mobileMenuRef = React.useRef<HTMLDivElement>(null)
  const navigationItemsRef = React.useRef<HTMLAnchorElement[]>([])

  // Focus trap for mobile menu
  useFocusTrap(isMobileMenuOpen, mobileMenuRef)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
    setFocusedIndex(-1)
  }, [pathname])

  // Handle keyboard navigation in mobile menu
  const handleMobileMenuKeyDown = (e: React.KeyboardEvent) => {
    if (!isMobileMenuOpen) return

    const menuItems = navigationItemsRef.current.filter(Boolean)

    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false)
      return
    }

    KeyboardNavigation.handleArrowKeys(
      e.nativeEvent,
      menuItems,
      focusedIndex,
      setFocusedIndex,
      { loop: true, horizontal: false }
    )

    KeyboardNavigation.handleHomeEnd(
      e.nativeEvent,
      menuItems,
      setFocusedIndex
    )
  }

  return (
    <header
      id="navigation"
      role="banner"
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight transition-colors hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
          aria-label="Portfolio - Go to homepage"
        >
          Portfolio
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className="md:hidden border-t bg-background/95 backdrop-blur-md"
          onKeyDown={handleMobileMenuKeyDown}
        >
          <nav className="container mx-auto px-4 py-4" role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.href}
                  ref={(el) => {
                    if (el) navigationItemsRef.current[index] = el
                  }}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground/80 py-2",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md",
                    pathname === item.href
                      ? "text-foreground border-l-2 border-foreground pl-4"
                      : "text-foreground/60 pl-4"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                  tabIndex={0}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}