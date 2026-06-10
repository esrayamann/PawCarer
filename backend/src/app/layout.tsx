import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: 'PawCarer | Güvenilir Evcil Hayvan Bakıcıları',
  description: 'Sadık dostlarınız için en güvenilir ve profesyonel bakıcı platformu.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
