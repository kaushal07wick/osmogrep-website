import { NextRequest, NextResponse } from 'next/server';

type WaitlistPayload = {
  email?: string;
  source?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: WaitlistPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const source = (body.source ?? 'website').trim();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const webhook = process.env.WAITLIST_GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      { error: 'Waitlist webhook is not configured on the server.' },
      { status: 503 },
    );
  }

  try {
    const forwarded = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source,
        submittedAt: new Date().toISOString(),
      }),
      cache: 'no-store',
    });

    if (!forwarded.ok) {
      return NextResponse.json(
        { error: 'Failed to push entry to Google Sheets.' },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Could not reach Google Sheets webhook.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
