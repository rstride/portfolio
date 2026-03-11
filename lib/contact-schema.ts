import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caracteres"),
  email: z.email("Veuillez entrer un email valide"),
  message: z
    .string()
    .trim()
    .min(10, "Le message doit contenir au moins 10 caracteres")
    .max(5000, "Le message est trop long"),
  company: z.string().trim().max(120, "Le nom de l'entreprise est trop long").optional().or(z.literal("")),
  phone: z.string().trim().max(40, "Le numero de telephone est trop long").optional().or(z.literal("")),
  website: z.string().trim().max(0, "Champ invalide").optional().or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export function getContactFieldErrors(data: ContactFormData): Record<string, string> {
  const result = contactSchema.safeParse(data);

  if (result.success) {
    return {};
  }

  const fieldErrors = result.error.flatten().fieldErrors;

  return Object.fromEntries(
    Object.entries(fieldErrors)
      .map(([key, value]) => [key, value?.[0]])
      .filter((entry): entry is [string, string] => Boolean(entry[1]))
  );
}
