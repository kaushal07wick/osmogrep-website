import './globals.css';
import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'Osmogrep — Intelligent Code Watchdog',
  description: 'Proactive runtime analysis for high-velocity teams.',
  icons: {
    icon: [
      { url: '/brand/favicon-e.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/brand/favicon-e.svg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      style={
        {
          '--font-mono':
            '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        } as Record<string, string>
      }
    >
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
