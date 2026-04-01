"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterOwner() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register/owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Kayıt olurken bir hata oluştu.');
      }

      // BaÅŸarÄ±lÄ±
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 animate-slide-up">
      <div className="glass-panel max-w-md w-full p-8 relative overflow-hidden">
        {/* Dekoratif daireler */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F47B20] opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#8B5A2B] opacity-10 rounded-full blur-2xl"></div>

        <div className="relative z-10 text-center mb-8">
          <h1 className="text-3xl font-bold text-[#8B5A2B] mb-2">Hayvan Sahibi Kaydı</h1>
          <p className="text-[#857D77] text-sm">Evcil dostunuz için en iyi bakıcıları bulun.</p>
        </div>

        {error && (
          <div className="bg-[#fee2e2] text-[#b91c1c] p-3 rounded-xl mb-6 text-sm border border-[#f87171] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-semibold text-[#3A3029] mb-1">Ad Soyad</label>
            <input 
              required
              className="input-field" 
              placeholder="Örn: Esra Yaman" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3A3029] mb-1">E-Posta</label>
            <input 
              required
              type="email"
              className="input-field" 
              placeholder="isim@ornek.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3A3029] mb-1">Şifre</label>
            <input 
              required
              type="password"
              className="input-field" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3A3029] mb-1">Şehir / Lokasyon</label>
            <input 
              className="input-field" 
              placeholder="Örn: Kadıköy, İstanbul"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Kaydediliyor...' : 'Hayvan Sahibi Hesabı Oluştur'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#857D77] relative z-10">
          Bakıcı olarak mı hizmet vermek istersiniz? <br/>
          <Link href="/register/sitter" className="text-[#F47B20] font-semibold hover:underline">Sitter (Bakıcı) Kaydı Yapın</Link>
        </p>
      </div>
    </div>
  );
}
