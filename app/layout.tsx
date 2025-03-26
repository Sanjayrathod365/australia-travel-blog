import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavMenu } from './components/nav-menu';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Australia Travel Blog',
  description: 'Discover the best destinations and experiences in Australia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <NavMenu />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
} 