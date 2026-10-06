import assert from "node:assert/strict";
import test from "node:test";

import {
  getContactFieldErrors,
  getContactServiceOption,
  hasContactFieldErrors,
  normalizeContactSource,
  normalizeContactPayload,
} from "@/features/contact/schema";
import { createTransportOptions, resolveContactMailConfig } from "@/features/contact/server/mail";
import { formatContactEmailText } from "@/features/contact/server/send-contact-email";

const expectedFrenchServiceMappings = {
  "web-application-pentest": "Pentest applicatif",
  "api-security-assessment": "Audit de sécurité API",
  "cloud-devsecops": "Audit Cloud & DevSecOps",
  "internal-infrastructure": "Audit d'infrastructure interne",
  "security-awareness": "Formation sécurité",
  "technical-operator-track": "Formation sécurité",
  "ctf-simulation-cell": "Formation sécurité",
} as const;

const expectedEnglishServiceMappings = {
  "web-application-pentest": "Web Application Pentest",
  "api-security-assessment": "API Security Assessment",
  "cloud-devsecops": "Cloud & DevSecOps Assessment",
  "internal-infrastructure": "Internal Infrastructure Audit",
  "security-awareness": "Security Training",
  "technical-operator-track": "Security Training",
  "ctf-simulation-cell": "Security Training",
} as const;

test("getContactFieldErrors returns localized French field errors", () => {
  const errors = getContactFieldErrors({
    name: "",
    email: "invalid",
    service: "",
    message: "short",
    company: "",
    phone: "",
  }, "fr");

  assert.equal(errors.name, "Indiquez votre nom ou celui de votre équipe.");
  assert.equal(errors.email, "Indiquez une adresse e-mail valide pour recevoir la réponse.");
  assert.equal(errors.service, "Sélectionnez le type de demande.");
  assert.equal(errors.message, "Ajoutez au moins 10 caractères pour cadrer la demande.");
});

test("getContactFieldErrors returns localized English field errors", () => {
  const errors = getContactFieldErrors({
    name: "",
    email: "invalid",
    service: "",
    message: "short",
    company: "",
    phone: "",
  }, "en");

  assert.equal(errors.name, "Enter your name or team name.");
  assert.equal(errors.email, "Enter a valid email address so I can reply.");
  assert.equal(errors.service, "Select the request type.");
  assert.equal(errors.message, "Add at least 10 characters to frame the request.");
});

test("normalizeContactPayload trims strings and lowercases email", () => {
  const payload = normalizeContactPayload({
    name: "  Romain Stride  ",
    email: "  USER@EXAMPLE.COM  ",
    service: "  Advisory / Architecture  ",
    message: "  A scoped request with context  ",
    company: "  Example Inc  ",
    phone: "  +33123456789  ",
    referrer: "  bot-field  ",
    source: "  project_prismasec  ",
  });

  assert.deepEqual(payload, {
    name: "Romain Stride",
    email: "user@example.com",
    service: "Advisory / Architecture",
    message: "A scoped request with context",
    company: "Example Inc",
    phone: "+33123456789",
    referrer: "bot-field",
    source: "project_prismasec",
  });
});

test("contact sources are restricted to known CTA values", () => {
  assert.equal(normalizeContactSource("home_hero"), "home_hero");
  assert.equal(normalizeContactSource(" project_prismasec "), "project_prismasec");
  assert.equal(normalizeContactSource("attacker-controlled"), undefined);
  assert.equal(normalizeContactPayload({ source: "attacker-controlled" }).source, undefined);
});

test("contact email includes the normalized CTA source without requiring SMTP", () => {
  const payload = normalizeContactPayload({
    name: "Romain Stride",
    email: "contact@example.test",
    service: "Web Application Pentest",
    message: "Please assess our SaaS application.",
    source: "project_prismasec",
  });

  assert.match(formatContactEmailText(payload), /^Source: project_prismasec$/m);
});

test("hasContactFieldErrors detects populated error maps", () => {
  assert.equal(hasContactFieldErrors({}), false);
  assert.equal(hasContactFieldErrors({ email: "Enter a valid email address so I can reply." }), true);
});

test("getContactServiceOption resolves every expected slug in French", () => {
  for (const [slug, label] of Object.entries(expectedFrenchServiceMappings)) {
    assert.equal(getContactServiceOption(slug, "fr"), label);
  }
});

test("getContactServiceOption resolves every expected slug in English", () => {
  for (const [slug, label] of Object.entries(expectedEnglishServiceMappings)) {
    assert.equal(getContactServiceOption(slug, "en"), label);
  }
});

test("getContactServiceOption ignores unknown slugs", () => {
  assert.equal(getContactServiceOption("unknown-service", "fr"), null);
});

test("createTransportOptions maps smtp config without mutation", () => {
  const transportOptions = createTransportOptions({
    host: "smtp.example.test",
    port: 465,
    user: "user",
    pass: "pass",
    secure: true,
    from: "from@example.test",
    to: "to@example.test",
  });

  assert.deepEqual(transportOptions, {
    host: "smtp.example.test",
    port: 465,
    secure: true,
    auth: {
      user: "user",
      pass: "pass",
    },
  });
});

test("production SMTP aliases resolve the contact mailbox", () => {
  const config = resolveContactMailConfig({
    EMAIL_HOST: "smtp.example.test",
    EMAIL_USER: "portfolio@example.test",
    EMAIL_PASS: "test-password",
    EMAIL_TO: "contact@example.test",
  });

  assert.deepEqual(config, {
    host: "smtp.example.test",
    port: 587,
    user: "portfolio@example.test",
    pass: "test-password",
    secure: false,
    from: "portfolio@example.test",
    to: "contact@example.test",
  });
});

test("dedicated portfolio SMTP credentials take precedence over aliases", () => {
  const config = resolveContactMailConfig({
    EMAIL_HOST: "smtp.example.test",
    EMAIL_PORT: "465",
    EMAIL_RSTRIDE: "portfolio@example.test",
    EMAIL_RSTRIDE_PASS: "portfolio-password",
    EMAIL_USER: "other@example.test",
    EMAIL_PASS: "other-password",
    EMAIL_FROM: "other-from@example.test",
    EMAIL_TO: "other-to@example.test",
  });

  assert.equal(config.user, "portfolio@example.test");
  assert.equal(config.pass, "portfolio-password");
  assert.equal(config.from, "portfolio@example.test");
  assert.equal(config.to, "portfolio@example.test");
  assert.equal(config.secure, true);
});

test("contact SMTP configuration rejects missing credentials", () => {
  assert.throws(() => resolveContactMailConfig({ EMAIL_HOST: "smtp.example.test" }),
    /Missing portfolio SMTP configuration/);
});
