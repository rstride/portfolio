export type SocialLink = {
  label: string;
  href: string;
};

export type ActionLink = {
  label: string;
  href: string;
};

export type TrustSignal = {
  value: string;
  label: string;
  detail: string;
};

export type EngagementStep = {
  title: string;
  description: string;
};

export type SectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export type PageCTA = {
  eyebrow: string;
  title: string;
  description: string;
  primary: ActionLink;
  secondary?: ActionLink;
};

export type ServiceIconKey = "shield" | "search" | "graduation-cap";

export type Service = {
  slug: string;
  title: string;
  description: string;
  deliverables: string[];
  benefits: string[];
  bestFor: string;
  outcome: string;
  notFor: string;
  format: string;
  timeline: string;
  proof: string;
  navigationDescription: string;
  icon: ServiceIconKey;
};

export type ServicePageDetail = {
  intro: string;
  audience: ReadonlyArray<string>;
  process: ReadonlyArray<string>;
  faqTitle: string;
  faqAnswer: string;
};

export type ServiceNavigationItem = {
  href: string;
  label: string;
  description: string;
  icon: ServiceIconKey;
};

export type HomeServiceSpotlight = {
  href: string;
  title: string;
  description: string;
  format: string;
  bestFor: string;
  timeline: string;
  deliverables: readonly string[];
  outcome: string;
  icon: ServiceIconKey;
  badge: string;
};

export type ProfileHighlight = {
  label: string;
  text: string;
};

export type HomeProfile = {
  badge: string;
  title: string;
  description: string;
  highlights: readonly ProfileHighlight[];
};

export type CaseStudy = {
  title: string;
  sector: string;
  context: string;
  intervention: string;
  result: string;
  proof: string;
};
