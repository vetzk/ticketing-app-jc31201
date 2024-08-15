import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import QueryProvider from '../utils/provider/QueryProvider';
import UserProvider from '@/contexts/UserContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <UserProvider>
            <Navbar />
            <main>{children}</main>
          </UserProvider>
        </QueryProvider>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
