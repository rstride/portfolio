import { GraduationCap, Search, Shield } from "lucide-react";

import {
  getServiceBySlug,
  getServiceHref,
  serviceNavigation,
  services,
} from "@/content/site/services";
import type { ServiceIconKey } from "@/content/site";

const serviceIconMap = {
  "graduation-cap": GraduationCap,
  search: Search,
  shield: Shield,
} as const;

export function getServiceIcon(icon: ServiceIconKey) {
  return serviceIconMap[icon];
}

export { getServiceBySlug, getServiceHref, serviceNavigation, services };
