import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Simple Global Navigation Bar */}
        <header className="glass-panel sticky top-0 z-50 rounded-none border-t-0 border-x-0 border-b border-[rgba(255,255,255,0.4)] px-6 py-4 flex items-center justify-between shadow-sm">
          <Link href="/" className="text-2xl font-bold text-[#8B5A2B] tracking-tight hover:opacity-80 transition-opacity">
            🐾 PawCarer
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-[#3A3029]">
             <Link href="/login" className="hover:text-[#F47B20] transition-colors">Giriş Yap</Link>
             <Link href="/register/owner" className="hover:text-[#F47B20] transition-colors">Kayıt Ol</Link>
             <Link href="/profile" className="px-4 py-2 rounded-full bg-[rgba(244,123,32,0.1)] text-[#F47B20] hover:bg-[#F47B20] hover:text-white transition-all">Profilim</Link>
          </nav>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
