import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'resumeforge — build a clean résumé, export to PDF',
  description:
    'A résumé builder with a live A4 preview, three print-ready themes, and one-click PDF export straight from the browser. No sign-up.',
  metadataBase: new URL('https://resumeforge-five-sigma.vercel.app'),
  openGraph: {
    title: 'resumeforge — build a clean résumé, export to PDF',
    description: 'Live A4 preview, three print-ready themes, one-click PDF export. No sign-up.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${serif.variable} antialiased`}>{children}</body>
    </html>
  );
}
