import { NextResponse } from 'next/server';

import {
  getContactFieldErrors,
  hasContactFieldErrors,
  normalizeContactPayload,
  type ContactPayload,
} from '@/features/contact/schema';
import { sendContactEmail } from '@/features/contact/server/send-contact-email';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = normalizeContactPayload(await request.json());
  } catch {
    return NextResponse.json(
      { error: 'Invalid request payload' },
      { status: 400 },
    );
  }

  if (payload.referrer) {
    return NextResponse.json({ ok: true });
  }

  const fieldErrors = getContactFieldErrors(payload);

  if (hasContactFieldErrors(fieldErrors)) {
    return NextResponse.json(
      {
        error: 'Please correct the highlighted fields',
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
      { error: 'Unable to deliver your message right now' },
      { status: 500 },
    );
  }
}
