import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { contactSchema } from '@/lib/contact-schema';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const submissionTracker = new Map<string, number[]>();

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
  const user =
    process.env.SMTP_USER ||
    process.env.EMAIL_USER ||
    process.env.EMAIL_RSTRIDE;
  const pass =
    process.env.SMTP_PASS ||
    process.env.EMAIL_PASS ||
    process.env.EMAIL_RSTRIDE_PASS;
  const secure = (process.env.SMTP_SECURE || 'false') === 'true';
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || user;
  const to =
    process.env.CONTACT_EMAIL ||
    process.env.EMAIL_TO ||
    process.env.EMAIL_RSTRIDE_TO ||
    user;

  return { host, port, user, pass, secure, from, to };
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  const recentAttempts = (submissionTracker.get(clientKey) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recentAttempts.length >= RATE_LIMIT_MAX_REQUESTS) {
    submissionTracker.set(clientKey, recentAttempts);
    return true;
  }

  recentAttempts.push(now);
  submissionTracker.set(clientKey, recentAttempts);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const parsedBody = contactSchema.safeParse(await request.json());
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0]?.message || 'Donnees invalides' },
        { status: 400 }
      );
    }

    const { name, email, service, scopeType, timeline, message, company, phone, website } = parsedBody.data;
    if (website) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const clientIp = getClientIp(request);
    const clientKey = `${clientIp}:${email.toLowerCase()}`;
    if (isRateLimited(clientKey)) {
      return NextResponse.json(
        { error: 'Trop de demandes ont ete envoyees. Veuillez patienter quelques minutes.' },
        { status: 429 }
      );
    }

    const smtp = getSmtpConfig();

    if (!smtp.host || !smtp.user || !smtp.pass || !smtp.to) {
      return NextResponse.json(
        { error: 'Configuration SMTP manquante. Veuillez configurer les variables d\'environnement.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
    const safeCompany = company ? escapeHtml(company) : '';
    const safePhone = phone ? escapeHtml(phone) : '';

    const mailOptions = {
      from: smtp.from,
      to: smtp.to,
      subject: `Nouveau message de contact - ${name}`,
      text: [
        `Nom: ${name}`,
        `Email: ${email}`,
        `Besoin: ${service}`,
        `Périmètre: ${scopeType}`,
        `Échéance: ${timeline}`,
        company ? `Entreprise: ${company}` : undefined,
        phone ? `Telephone: ${phone}` : undefined,
        '',
        message,
      ]
        .filter(Boolean)
        .join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #22c55e; margin-bottom: 30px; text-align: center;">Nouveau message de contact</h1>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 8px;">Informations de l'expéditeur</h3>
              <p style="margin: 5px 0;"><strong>Nom:</strong> ${safeName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #22c55e;">${safeEmail}</a></p>
              <p style="margin: 5px 0;"><strong>Besoin:</strong> ${escapeHtml(service)}</p>
              <p style="margin: 5px 0;"><strong>Périmètre:</strong> ${escapeHtml(scopeType)}</p>
              <p style="margin: 5px 0;"><strong>Échéance:</strong> ${escapeHtml(timeline)}</p>
              ${safeCompany ? `<p style="margin: 5px 0;"><strong>Entreprise:</strong> ${safeCompany}</p>` : ''}
              ${safePhone ? `<p style="margin: 5px 0;"><strong>Téléphone:</strong> ${safePhone}</p>` : ''}
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 8px;">Message</h3>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; border-left: 4px solid #22c55e;">
                ${safeMessage}
              </div>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p>Ce message a été envoyé depuis le formulaire de contact de votre portfolio.</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
            </div>
          </div>
        </div>
      `,
      replyTo: `"${safeName}" <${email}>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Message envoyé avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);

    let errorMessage = 'Erreur lors de l\'envoi du message';

    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Impossible de se connecter au serveur SMTP. Vérifiez votre configuration.';
      } else if (error.message.includes('Authentication failed')) {
        errorMessage = 'Échec d\'authentification SMTP. Vérifiez vos credentials.';
      } else if (error.message.includes('Invalid login')) {
        errorMessage = 'Identifiants SMTP invalides.';
      } else {
        errorMessage = `Erreur SMTP: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
