import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-xl w-full border border-grid bg-white/70 rounded-sm p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-accent">Page not found</h1>
        <p className="mt-3 text-ink-light">
          The page you are looking for does not exist or was moved.
        </p>
        <div className="mt-6">
          <Link href="/" className="btn-primary px-5 py-2.5">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
