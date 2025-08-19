import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'VidHire - AI Video Interviewer',
  description: 'AI-Powered Video Interview Bot to streamline your hiring process.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          'relative h-full font-sans antialiased',
          inter.variable
        )}
      >
        <main className="relative flex flex-col min-h-screen">
          <Header />
          <div className="flex-grow flex-1">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
