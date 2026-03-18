import { escapeHtml } from "@/features/contact/server/security";
import type { SmtpConfig } from "@/features/contact/server/config";

type ContactPayload = {
  name: string;
  email: string;
  service: string;
  scopeType: string;
  timeline: string;
  message: string;
  company?: string;
  phone?: string;
};

export function createTransportOptions(smtp: SmtpConfig) {
  return {
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  };
}

export function createContactMailOptions(smtp: SmtpConfig, payload: ContactPayload) {
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, "<br>");
  const safeCompany = payload.company ? escapeHtml(payload.company) : "";
  const safePhone = payload.phone ? escapeHtml(payload.phone) : "";

  return {
    from: smtp.from,
    to: smtp.to,
    subject: `Nouveau message de contact - ${payload.name}`,
    text: [
      `Nom: ${payload.name}`,
      `Email: ${payload.email}`,
      `Besoin: ${payload.service}`,
      `Périmètre: ${payload.scopeType}`,
      `Échéance: ${payload.timeline}`,
      payload.company ? `Entreprise: ${payload.company}` : undefined,
      payload.phone ? `Telephone: ${payload.phone}` : undefined,
      "",
      payload.message,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #16a34a; margin-bottom: 30px; text-align: center;">Nouveau message de contact</h1>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 8px;">Informations de l'expéditeur</h3>
            <p style="margin: 5px 0;"><strong>Nom:</strong> ${safeName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #16a34a;">${safeEmail}</a></p>
            <p style="margin: 5px 0;"><strong>Besoin:</strong> ${escapeHtml(payload.service)}</p>
            <p style="margin: 5px 0;"><strong>Périmètre:</strong> ${escapeHtml(payload.scopeType)}</p>
            <p style="margin: 5px 0;"><strong>Échéance:</strong> ${escapeHtml(payload.timeline)}</p>
            ${safeCompany ? `<p style="margin: 5px 0;"><strong>Entreprise:</strong> ${safeCompany}</p>` : ""}
            ${safePhone ? `<p style="margin: 5px 0;"><strong>Téléphone:</strong> ${safePhone}</p>` : ""}
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 8px;">Message</h3>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; border-left: 4px solid #16a34a;">
              ${safeMessage}
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Ce message a été envoyé depuis le formulaire de contact de votre portfolio.</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString("fr-FR")}</p>
          </div>
        </div>
      </div>
    `,
    replyTo: `"${safeName}" <${payload.email}>`,
  };
}
