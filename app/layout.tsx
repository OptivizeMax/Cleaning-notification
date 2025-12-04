import '../styles/globals.css';
import type { ReactNode } from 'react';
import Header from '../components/Header';

export const metadata = {
  title: 'Optivize Max | Retail Space Consultancy',
  description: 'Retail layout optimization and merchandising plans tailored for small shops and neighborhood stores.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white">
        <Header />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}
