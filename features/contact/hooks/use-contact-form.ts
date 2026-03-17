"use client";

import { useState } from "react";

import { type ContactFormData, getContactFieldErrors } from "@/lib/contact-schema";

import { EMPTY_FORM_DATA } from "@/features/contact/model";

type ContactSubmitStatus = "idle" | "success" | "error";
type ContactFieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<ContactSubmitStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (nextFormData: ContactFormData) => {
    const validationErrors = getContactFieldErrors(nextFormData);
    setErrors(validationErrors);
    return validationErrors;
  };

  const handleInputChange = (event: React.ChangeEvent<ContactFieldElement>) => {
    const { name, value } = event.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    if (touched[name]) {
      validate(nextFormData);
    }
  };

  const handleBlur = (event: React.FocusEvent<ContactFieldElement>) => {
    const { name, value } = event.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);
    setTouched((previous) => ({ ...previous, [name]: true }));
    validate(nextFormData);
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM_DATA);
    setSubmitStatus("idle");
    setErrors({});
    setTouched({});
    setSubmitError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const allTouched = Object.keys(formData).reduce<Record<string, boolean>>(
      (accumulator, key) => ({ ...accumulator, [key]: true }),
      {}
    );
    setTouched(allTouched);
    setSubmitError(null);

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setSubmitStatus("success");
      setSubmitError(null);

      window.setTimeout(() => {
        resetForm();
      }, 4000);
    } catch (error) {
      setSubmitStatus("error");
      setSubmitError(
        error instanceof Error ? error.message : "Une erreur technique s'est produite."
      );

      window.setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    errors,
    formData,
    handleBlur,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    submitError,
    submitStatus,
    touched,
  };
}
