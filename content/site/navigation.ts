import type { ActionLink, SocialLink } from "@/content/site/types";

export const primaryNav = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
] as ActionLink[];

export const navPrimaryCta = {
  href: "/contact",
  label: "Contact",
} as const satisfies ActionLink;

export const socials = [
  { label: "GitHub", href: "https://github.com/rstride" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/romainstride" },
  { label: "PrismaSec", href: "https://prismasec.fr" },
] as SocialLink[];
