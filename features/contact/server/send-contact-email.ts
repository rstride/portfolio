import nodemailer from 'nodemailer';

import type { ContactPayload } from '@/features/contact/schema';
import { createTransportOptions, getRstrideMailConfig } from '@/features/contact/server/mail';

function formatOptional(value: string | undefined) {
  return value && value.length > 0 ? value : 'N/A';
}

export function formatContactEmailText(payload: ContactPayload) {
  return [
    'Nouvelle demande de contact portfolio',
    '',
    `Nom: ${payload.name}`,
    `Email: ${payload.email}`,
    `Entreprise: ${formatOptional(payload.company)}`,
    `Telephone: ${formatOptional(payload.phone)}`,
    `Service: ${payload.service}`,
    `Source: ${formatOptional(payload.source)}`,
    '',
    'Message:',
    payload.message,
  ].join('\n');
}

export async function sendContactEmail(payload: ContactPayload) {
  const config = getRstrideMailConfig();
  const transporter = nodemailer.createTransport(createTransportOptions(config));

  const subject = `[Portfolio] ${payload.service} - ${payload.name}`;
  const text = formatContactEmailText(payload);

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: payload.email,
    subject,
    text,
  });
}
