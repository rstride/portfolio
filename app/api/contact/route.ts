import { NextResponse } from 'next/server';

import {
  type ContactLocale,
  getContactFieldErrors,
  hasContactFieldErrors,
  normalizeContactPayload,
  type ContactPayload,
} from '@/features/contact/schema';
import { sendContactEmail } from '@/features/contact/server/send-contact-email';

export const runtime = 'nodejs';

const responseMessages = {
  fr: {
    invalidFields: 'Corrigez les champs signalés avant d’envoyer.',
    deliveryFailed:
      'Le message n’a pas pu être envoyé. Réessayez ou écrivez directement à contact@rstride.fr.',
  },
  en: {
    invalidFields: 'Correct the highlighted fields before sending.',
    deliveryFailed:
      'The message could not be sent. Try again or email contact@rstride.fr directly.',
  },
} satisfies Record<ContactLocale, { invalidFields: string; deliveryFailed: string }>;

function getLocale(input: unknown): ContactLocale {
  if (
    typeof input === 'object' &&
    input !== null &&
    'locale' in input &&
    input.locale === 'en'
  ) {
    return 'en';
  }

  return 'fr';
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  let locale: ContactLocale = 'fr';

  try {
    const body = await request.json();
    locale = getLocale(body);
    payload = normalizeContactPayload(body);
  } catch {
    return NextResponse.json(
      { error: 'Invalid request payload' },
      { status: 400 },
    );
  }

  if (payload.referrer) {
    return NextResponse.json({ ok: true });
  }

  const fieldErrors = getContactFieldErrors(payload, locale);

  if (hasContactFieldErrors(fieldErrors)) {
    return NextResponse.json(
      {
        error: responseMessages[locale].invalidFields,
        fieldErrors,
      },
      { status: 422 },
    );
  }

  try {
    await sendContactEmail(payload);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: responseMessages[locale].deliveryFailed },
      { status: 500 },
    );
  }
}
