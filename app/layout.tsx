import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavMenu } from './components/nav-menu';

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
    <html lang="en">
      <body className={inter.className}>
        <NavMenu />
        <main>{children}</main>
      </body>
    </html>
  );
} 