"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const ContactSchema = z.object({
  name: z.string().min(2, "Merci d’indiquer votre nom"),
  email: z.string().email("Merci d’indiquer un email valide"),
  message: z.string().min(10, "Merci de préciser votre demande"),
  website: z.string().optional(), // honeypot
});

type ContactFormValues = z.infer<typeof ContactSchema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({ resolver: zodResolver(ContactSchema) });

  async function onSubmit(values: ContactFormValues) {
    // Honeypot: ignore if filled
    if (values.website && values.website.trim().length > 0) {
      setSubmitted(true);
      reset();
      return;
    }
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setSubmitted(true);
      reset();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm">Name</label>
        <input id="name" className="w-full rounded-md border border-input bg-background px-3 py-2" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm">Email</label>
        <input id="email" type="email" className="w-full rounded-md border border-input bg-background px-3 py-2" {...register("email")} />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>
      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm">Message</label>
        <textarea id="message" rows={5} className="w-full rounded-md border border-input bg-background px-3 py-2" {...register("message")} />
        {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
      </div>

      {/* Honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register("website")} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-md bg-foreground text-background h-10 px-4 text-sm font-medium hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
      {submitted && <p className="text-sm text-green-500">Merci ! Je vous réponds rapidement.</p>}
    </form>
  );
}


