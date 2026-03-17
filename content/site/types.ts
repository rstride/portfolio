export type SocialLink = {
  label: string;
  href: string;
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
  navigationDescription: string;
  icon: ServiceIconKey;
};

export type ServicePageDetail = {
  intro: string;
  audience: ReadonlyArray<string>;
  process: ReadonlyArray<string>;
};

export type ServiceNavigationItem = {
  href: string;
  label: string;
  description: string;
};

export type CaseStudy = {
  title: string;
  sector: string;
  context: string;
  intervention: string;
  result: string;
  proof: string;
};
