import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import Navbar from './components/navbar/Navbar';
import Footer from './components/Footer';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-code', display: 'swap' });

const siteName = 'Osmogrep';
const siteDescription = 'Proactive runtime analysis for high-velocity teams.';
const defaultSiteUrl = 'https://osmogrep.com';
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL;
const siteUrl = rawSiteUrl
  ? rawSiteUrl.startsWith('http')
    ? rawSiteUrl
    : `https://${rawSiteUrl}`
  : defaultSiteUrl;
const ogImagePath = '/opengraph-image';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Osmogrep - Intelligent Code Watchdog',
    template: '%s | Osmogrep',
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [{ url: '/brand/favicon-terminal.svg', type: 'image/svg+xml' }],
    shortcut: ['/brand/favicon-terminal.svg'],
    apple: [{ url: '/brand/favicon-terminal.svg' }],
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName,
    title: 'Osmogrep - Intelligent Code Watchdog',
    description: siteDescription,
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 630,
        alt: 'Osmogrep product preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Osmogrep - Intelligent Code Watchdog',
    description: siteDescription,
    images: ['/twitter-image'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FBFBF9',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
