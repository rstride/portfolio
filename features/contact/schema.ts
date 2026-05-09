export type ContactPayload = {
  name: string;
  email: string;
  service: string;
  message: string;
  company?: string;
  phone?: string;
  referrer?: string;
};

export type ContactLocale = "fr" | "en";
export type ContactFieldErrors = Partial<Record<"name" | "email" | "service" | "message", string>>;
export type ContactServiceSlug =
  | "web-application-pentest"
  | "cloud-devsecops"
  | "internal-infrastructure"
  | "security-awareness"
  | "technical-operator-track"
  | "ctf-simulation-cell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const contactServiceOptions = {
  fr: ["Web Application Pentest", "Infrastructure Audit", "Security Training", "Advisory / Architecture"],
  en: ["Web Application Pentest", "Infrastructure Audit", "Security Training", "Advisory / Architecture"],
} satisfies Record<ContactLocale, string[]>;

const contactServiceSlugMap = {
  "web-application-pentest": {
    fr: "Web Application Pentest",
    en: "Web Application Pentest",
  },
  "cloud-devsecops": {
    fr: "Infrastructure Audit",
    en: "Infrastructure Audit",
  },
  "internal-infrastructure": {
    fr: "Infrastructure Audit",
    en: "Infrastructure Audit",
  },
  "security-awareness": {
    fr: "Security Training",
    en: "Security Training",
  },
  "technical-operator-track": {
    fr: "Security Training",
    en: "Security Training",
  },
  "ctf-simulation-cell": {
    fr: "Security Training",
    en: "Security Training",
  },
} satisfies Record<ContactServiceSlug, Record<ContactLocale, string>>;

const validationMessages = {
  fr: {
    name: "Indiquez votre nom ou celui de votre équipe.",
    email: "Indiquez une adresse e-mail valide pour recevoir la réponse.",
    service: "Sélectionnez le type de demande.",
    message: "Ajoutez au moins 10 caractères pour cadrer la demande.",
  },
  en: {
    name: "Enter your name or team name.",
    email: "Enter a valid email address so I can reply.",
    service: "Select the request type.",
    message: "Add at least 10 characters to frame the request.",
  },
} satisfies Record<ContactLocale, Required<ContactFieldErrors>>;

function isContactInput(input: unknown): input is Partial<ContactPayload> {
  return typeof input === "object" && input !== null;
}

function trimValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function getContactServiceOption(
  slug: unknown,
  locale: ContactLocale = "fr",
) {
  const normalizedSlug = trimValue(slug);

  if (normalizedSlug in contactServiceSlugMap) {
    return contactServiceSlugMap[normalizedSlug as ContactServiceSlug][locale];
  }

  return null;
}

export function normalizeContactPayload(input: unknown): ContactPayload {
  const payload = isContactInput(input) ? input : {};

  return {
    name: trimValue(payload.name),
    email: trimValue(payload.email).toLowerCase(),
    service: trimValue(payload.service),
    message: trimValue(payload.message),
    company: trimValue(payload.company),
    phone: trimValue(payload.phone),
    referrer: trimValue(payload.referrer),
  };
}

export function getContactFieldErrors(
  input: unknown,
  locale: ContactLocale = "fr",
): ContactFieldErrors {
  const payload = normalizeContactPayload(input);
  const messages = validationMessages[locale];
  const errors: ContactFieldErrors = {};

  if (payload.name.length < 2) {
    errors.name = messages.name;
  }

  if (!EMAIL_RE.test(payload.email)) {
    errors.email = messages.email;
  }

  if (!payload.service) {
    errors.service = messages.service;
  }

  if (payload.message.length < 10) {
    errors.message = messages.message;
  }

  return errors;
}

export function hasContactFieldErrors(errors: ContactFieldErrors) {
  return Object.keys(errors).length > 0;
}
