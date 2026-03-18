export type {
  ActionLink,
  CaseStudy,
  EngagementStep,
  HomeProfile,
  HomeServiceSpotlight,
  PageCTA,
  ProfileHighlight,
  SectionCopy,
  Service,
  ServiceIconKey,
  ServiceNavigationItem,
  SocialLink,
  TrustSignal,
} from "@/content/site/types";

import { about, company, name, role, strings } from "@/content/site/identity";
import {
  caseStudies,
  engagementSteps,
  hero,
  homeEngagementSteps,
  homeProfile,
  homeProofs,
  homeSections,
  homeServiceSpotlights,
  pageCtas,
  privacyContent,
  proofs,
  sales,
  sections,
  trustSignals,
} from "@/content/site/marketing";
import { navPrimaryCta, primaryNav, socials } from "@/content/site/navigation";
import { servicePages, serviceNavigation, services } from "@/content/site/services";

export const site = {
  name,
  role,
  company,
  primaryNav,
  navPrimaryCta,
  serviceNavigation,
  hero,
  socials,
  caseStudies,
  services,
  homeSections,
  homeProofs,
  homeServiceSpotlights,
  homeProfile,
  trustSignals,
  about,
  sections,
  strings,
  privacyContent,
  proofs,
  sales,
  engagementSteps,
  homeEngagementSteps,
  pageCtas,
  servicePages,
} as const;

export type SiteContent = typeof site;
