import Link from "next/link"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: Linkedin,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
  },
  {
    name: "Email",
    href: "mailto:hello@example.com",
    icon: Mail,
  },
]

const footerLinks = [
  {
    title: "Navigation",
    links: [
      { name: "Home", href: "/" },
      { name: "Projects", href: "/projects" },
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Styleguide", href: "/styleguide" },
      { name: "Now", href: "/now" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand and Description */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight mb-4 block"
            >
              Portfolio
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              A production-ready portfolio showcasing world-class scroll animations,
              modular architecture, and exceptional user experience.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:bg-muted"
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <social.icon className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          
          {/* CTA */}
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              Available for new opportunities
            </p>
            <Button asChild size="sm">
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}