import './globals.css';
import type { ReactNode } from 'react';
import Header from '../components/Header';

export const metadata = {
  title: 'Cleaning Updates',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Header />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
