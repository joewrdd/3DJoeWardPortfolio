import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  title: 'Joe Ward | 3D Portfolio',
  description: 'Drive through my portfolio — an interactive 3D experience showcasing projects, skills, and journey.',
  keywords: ['portfolio', 'developer', 'flutter', 'react', 'nextjs', '3D', 'interactive'],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Joe Ward | 3D Portfolio',
    description: 'Drive through my portfolio — an interactive 3D experience.',
    type: 'website',
    siteName: 'Joe Ward Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joe Ward | 3D Portfolio',
    description: 'Drive through my portfolio — an interactive 3D experience.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
