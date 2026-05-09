import assert from "node:assert/strict";
import test from "node:test";

import {
  getContactFieldErrors,
  getContactServiceOption,
  hasContactFieldErrors,
  normalizeContactPayload,
} from "@/features/contact/schema";
import { createTransportOptions } from "@/features/contact/server/mail";

const expectedServiceMappings = {
  "web-application-pentest": "Web Application Pentest",
  "cloud-devsecops": "Infrastructure Audit",
  "internal-infrastructure": "Infrastructure Audit",
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
  });

  assert.deepEqual(payload, {
    name: "Romain Stride",
    email: "user@example.com",
    service: "Advisory / Architecture",
    message: "A scoped request with context",
    company: "Example Inc",
    phone: "+33123456789",
    referrer: "bot-field",
  });
});

test("hasContactFieldErrors detects populated error maps", () => {
  assert.equal(hasContactFieldErrors({}), false);
  assert.equal(hasContactFieldErrors({ email: "Enter a valid email address so I can reply." }), true);
});

test("getContactServiceOption resolves every expected slug in French", () => {
  for (const [slug, label] of Object.entries(expectedServiceMappings)) {
    assert.equal(getContactServiceOption(slug, "fr"), label);
  }
});

test("getContactServiceOption resolves every expected slug in English", () => {
  for (const [slug, label] of Object.entries(expectedServiceMappings)) {
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
