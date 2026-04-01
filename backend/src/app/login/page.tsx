"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Giriş yapılamadı. Bilgilerinizi kontrol ediniz.');
      }

      // JWT Token and User data saved temporarily in localStorage for auth state (simple client approach for the assignment)
      localStorage.setItem('pawcarer_token', data.token);
      localStorage.setItem('pawcarer_user', JSON.stringify(data.user));

      router.push('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 animate-slide-up">
      <div className="glass-panel max-w-md w-full p-8 relative overflow-hidden">
        {/* Dekoratif */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8B5A2B] opacity-10 rounded-full blur-2xl"></div>

        <div className="relative z-10 text-center mb-8">
          <div className="text-4xl mb-3">🐾</div>
          <h1 className="text-3xl font-bold text-[#8B5A2B] mb-2">Hoş Geldiniz</h1>
          <p className="text-[#857D77] text-sm">Devam etmek için giriş yapınız.</p>
        </div>

        {isRegistered && (
          <div className="bg-[#dcfce7] text-[#166534] p-3 rounded-xl mb-6 text-sm border border-[#86efac] text-center">
            Kayıt başarılı! Şimdi giriş yapabilirsiniz.
          </div>
        )}

        {error && (
          <div className="bg-[#fee2e2] text-[#b91c1c] p-3 rounded-xl mb-6 text-sm border border-[#f87171] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-semibold text-[#3A3029] mb-1">E-Posta</label>
            <input 
              required
              type="email"
              className="input-field" 
              placeholder="E-posta adresiniz" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3A3029] mb-1">Şifre</label>
            <input 
              required
              type="password"
              className="input-field" 
              placeholder="Şifreniz"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full shadow-md text-lg">
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[rgba(139,90,43,0.1)] pt-6 relative z-10">
          <p className="text-sm text-[#857D77]">Hesabınız yok mu?</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/register/owner" className="text-[#F47B20] font-semibold hover:underline">Müşteri Kaydı</Link>
            <span className="text-gray-300">|</span>
            <Link href="/register/sitter" className="text-[#8B5A2B] font-semibold hover:underline">Bakıcı Kaydı</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#8B5A2B]">Yükleniyor...</div>}>
      <LoginForm />
    </Suspense>
  );
}
