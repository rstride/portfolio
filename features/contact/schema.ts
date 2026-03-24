export type ContactPayload = {
  name: string;
  email: string;
  service: string;
  message: string;
  company?: string;
  phone?: string;
  referrer?: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeContactPayload(input: Partial<ContactPayload>): ContactPayload {
  return {
    name: trimValue(input.name),
    email: trimValue(input.email).toLowerCase(),
    service: trimValue(input.service),
    message: trimValue(input.message),
    company: trimValue(input.company),
    phone: trimValue(input.phone),
    referrer: trimValue(input.referrer),
  };
}

export function getContactFieldErrors(input: Partial<ContactPayload>): ContactFieldErrors {
  const payload = normalizeContactPayload(input);
  const errors: ContactFieldErrors = {};

  if (payload.name.length < 2) {
    errors.name = "Le nom doit contenir au moins 2 caracteres";
  }

  if (!EMAIL_RE.test(payload.email)) {
    errors.email = "Veuillez entrer un email valide";
  }

  if (!payload.service) {
    errors.service = "Veuillez selectionner un type de demande";
  }

  if (payload.message.length < 10) {
    errors.message = "Le message doit contenir au moins 10 caracteres";
  }

  return errors;
}

export function hasContactFieldErrors(errors: ContactFieldErrors) {
  return Object.keys(errors).length > 0;
}
