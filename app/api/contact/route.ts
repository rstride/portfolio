import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { contactSchema } from "@/lib/contact-schema";
import { getSmtpConfig } from "@/lib/contact/config";
import { createContactMailOptions, createTransportOptions } from "@/lib/contact/mail";
import { getClientIp, isRateLimited } from "@/lib/contact/security";

export async function POST(request: NextRequest) {
  try {
    const parsedBody = contactSchema.safeParse(await request.json());
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0]?.message || "Donnees invalides" },
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

    const transporter = nodemailer.createTransport(createTransportOptions(smtp));

    const mailOptions = createContactMailOptions(smtp, {
      name,
      email,
      service,
      scopeType,
      timeline,
      message,
      company,
      phone,
    });

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Message envoyé avec succès" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);

    let errorMessage = "Erreur lors de l'envoi du message";

    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        errorMessage = "Impossible de se connecter au serveur SMTP. Vérifiez votre configuration.";
      } else if (error.message.includes("Authentication failed")) {
        errorMessage = "Échec d'authentification SMTP. Vérifiez vos credentials.";
      } else if (error.message.includes("Invalid login")) {
        errorMessage = "Identifiants SMTP invalides.";
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
