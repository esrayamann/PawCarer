"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const check = () => {
    const token = localStorage.getItem("pawcarer_token");
    setIsLoggedIn(!!token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.role === "ADMIN");
      } catch {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  };

  // Sayfa değişiminde tekrar kontrol et
  useEffect(() => {
    check();
  }, [pathname]);

  // Başka sekmelerdeki değişiklikleri yakala
  useEffect(() => {
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pawcarer_token");
    localStorage.removeItem("pawcarer_user");
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push("/login");
  };

  return (
    <header className="glass-panel sticky top-0 z-50 rounded-none border-t-0 border-x-0 border-b border-[rgba(255,255,255,0.4)] px-6 py-4 flex items-center justify-between shadow-sm">
      <Link href="/" className="text-2xl font-bold text-[#8B5A2B] tracking-tight hover:opacity-80 transition-opacity">
        🐾 PawCarer
      </Link>

      <nav className="flex items-center gap-4 text-sm font-medium text-[#3A3029]">
        <Link href="/search" className="hover:text-[#F47B20] transition-colors">
          Bakıcı Bul
        </Link>

        {isLoggedIn ? (
          <>
            <Link href="/reviews" className="hover:text-[#F47B20] transition-colors">
              Yorumlarım
            </Link>
            {isAdmin && (
              <Link href="/admin" className="hover:text-red-600 transition-colors font-semibold">
                🛡️ Admin
              </Link>
            )}
            <Link
              href="/profile"
              className="px-4 py-2 rounded-full bg-[rgba(244,123,32,0.1)] text-[#F47B20] hover:bg-[#F47B20] hover:text-white transition-all"
            >
              Profilim
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-all font-medium"
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-[#F47B20] transition-colors">
              Giriş Yap
            </Link>
            <Link
              href="/register/owner"
              className="px-4 py-2 rounded-full bg-[rgba(244,123,32,0.1)] text-[#F47B20] hover:bg-[#F47B20] hover:text-white transition-all"
            >
              Kayıt Ol
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
