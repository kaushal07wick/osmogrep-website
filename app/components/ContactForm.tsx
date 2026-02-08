'use client';

import { FormEvent, useState } from 'react';

type ContactFormProps = {
  source?: string;
};

export default function ContactForm({ source = 'pricing-contact' }: ContactFormProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;

    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message, source }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setFeedback(data.error ?? 'Failed to send message.');
        return;
      }

      setStatus('success');
      setFeedback('Thanks. We received your message and will reply shortly.');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
      setFeedback('Request failed. Please try again.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3 max-w-2xl">
      <div className="space-y-1">
        <label htmlFor="contact-email" className="text-xs uppercase tracking-wide text-ink-light">
          Work Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          required
          className="w-full px-4 py-3 border border-grid rounded-sm bg-white focus:outline-none focus:border-accent"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="contact-message" className="text-xs uppercase tracking-wide text-ink-light">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your deployment setup, traffic profile, and what help you need."
          required
          minLength={8}
          maxLength={2500}
          rows={5}
          className="w-full px-4 py-3 border border-grid rounded-sm bg-white resize-y focus:outline-none focus:border-accent"
        />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === 'loading'} className="btn-primary px-6 py-2.5 disabled:opacity-70">
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
        <p className="text-xs text-ink-light">Replies usually within 1 business day.</p>
      </div>

      {status !== 'idle' && (
        <p className={`text-xs ${status === 'success' ? 'text-green-700' : 'text-red-600'}`}>{feedback}</p>
      )}
    </form>
  );
}
