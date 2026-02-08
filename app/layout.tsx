import './globals.css';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Osmogrep — Intelligent Code Watchdog',
  description: 'Proactive runtime analysis for high-velocity teams.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23EA580C%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><circle cx=%2212%22 cy=%2212%22 r=%2210%22/><path d=%22M2 12h20M12 2v20M12 12l7.07 7.07%22/><circle cx=%2212%22 cy=%2212%22 r=%223%22 fill=%22%23EA580C%22/></svg>',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
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
