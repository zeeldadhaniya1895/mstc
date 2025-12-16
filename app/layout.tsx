import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'MSTC | Microsoft Student Technical Club',
  description: 'Code. Compete. Conquer. The official platform for MSTC.',
};

import { Providers } from './providers';

// ... imports

import { auth } from '@/auth';

import { ShatterBackground } from '@/components/ui/shatter-background';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#202124] text-[#E8EAED] selection:bg-shatter-blue selection:text-black`}
      >
        <ShatterBackground />
        <Providers session={session}>
          {children}
        </Providers>
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}
// Forced Rebuild for SessionProvider Context pass
