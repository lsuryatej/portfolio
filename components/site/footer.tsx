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
      // { name: "Blog", href: "/blog" }, // Coming soon
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
    <footer id="footer" className="border-t bg-background" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand and Description */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight mb-4 block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
              aria-label="Portfolio - Go to homepage"
            >
              Portfolio
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-md whitespace-normal leading-relaxed">
              A personal portfolio website focusing on modular architecture and exceptional user experience.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-2" role="list" aria-label="Social media links">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:bg-muted"
                  role="listitem"
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${social.name} profile (opens in new tab)`}
                  >
                    <social.icon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <nav key={section.title} aria-labelledby={`footer-${section.title.toLowerCase()}`}>
              <h3 id={`footer-${section.title.toLowerCase()}`} className="font-semibold mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2" role="list">
                {section.links.map((link) => (
                  <li key={link.href} role="listitem">
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
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
              <Link href="/contact" aria-label="Contact me about new opportunities">
                Get in touch
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}