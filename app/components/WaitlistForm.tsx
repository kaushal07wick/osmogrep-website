'use client';

import { FormEvent, useState } from 'react';

type WaitlistFormProps = {
  source?: string;
};

export default function WaitlistForm({ source = 'web-shell' }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error ?? 'Failed to submit email.');
        return;
      }

      setStatus('success');
      setMessage('Added to waitlist.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Request failed. Please try again.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your work email"
        required
        className="flex-1 px-4 py-3 border border-grid rounded-sm bg-white focus:outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary px-6 py-3 disabled:opacity-70"
      >
        {status === 'loading' ? 'Submitting...' : 'Join Waitlist'}
      </button>
      {status !== 'idle' && (
        <p className={`sm:col-span-2 text-xs ${status === 'success' ? 'text-green-700' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
