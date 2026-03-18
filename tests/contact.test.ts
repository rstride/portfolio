import assert from "node:assert/strict";
import test from "node:test";

import { getContactFieldErrors } from "@/features/contact/schema";
import { createTransportOptions } from "@/features/contact/server/mail";

test("getContactFieldErrors returns keyed messages for invalid data", () => {
  const errors = getContactFieldErrors({
    name: "",
    email: "invalid",
    service: "",
    scopeType: "",
    timeline: "",
    message: "short",
    company: "",
    phone: "",
    website: "",
  });

  assert.equal(errors.name, "Le nom doit contenir au moins 2 caracteres");
  assert.equal(errors.email, "Veuillez entrer un email valide");
  assert.equal(errors.message, "Le message doit contenir au moins 10 caracteres");
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
