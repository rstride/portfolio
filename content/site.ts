export type {
  CaseStudy,
  Service,
  ServiceIconKey,
  ServiceNavigationItem,
  SocialLink,
} from "@/content/site/types";

import { about, company, name, role, strings } from "@/content/site/identity";
import { caseStudies, hero, privacyContent, proofs, sales, sections } from "@/content/site/marketing";
import { nav, socials } from "@/content/site/navigation";
import { servicePages, serviceNavigation, services } from "@/content/site/services";

export const site = {
  name,
  role,
  company,
  nav,
  serviceNavigation,
  hero,
  socials,
  caseStudies,
  services,
  about,
  sections,
  strings,
  privacyContent,
  proofs,
  sales,
  servicePages,
} as const;

export type SiteContent = typeof site;
