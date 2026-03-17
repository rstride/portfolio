import type { SocialLink } from "@/content/site/types";

export const nav = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const socials = [
  { label: "GitHub", href: "https://github.com/rstride" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/romainstride" },
  { label: "PrismaSec", href: "https://prismasec.fr" },
] as SocialLink[];
