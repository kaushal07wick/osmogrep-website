import { NextRequest, NextResponse } from 'next/server';

type ContactPayload = {
  email?: string;
  message?: string;
  source?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: ContactPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const message = (body.message ?? '').trim();
  const source = (body.source ?? 'pricing-contact').trim();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (message.length < 8) {
    return NextResponse.json({ error: 'Please include a short message (at least 8 characters).' }, { status: 400 });
  }

  if (message.length > 2500) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
  }

  const webhook =
    process.env.CONTACT_GOOGLE_SHEETS_WEBHOOK_URL ??
    process.env.WAITLIST_GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhook) {
    return NextResponse.json(
      { error: 'Contact webhook is not configured on the server.' },
      { status: 503 },
    );
  }

  try {
    const forwarded = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        message,
        source,
        submittedAt: new Date().toISOString(),
      }),
      cache: 'no-store',
    });

    if (!forwarded.ok) {
      return NextResponse.json(
        { error: 'Failed to submit contact request.' },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Could not reach contact webhook.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
