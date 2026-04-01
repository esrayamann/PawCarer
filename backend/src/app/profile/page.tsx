"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');

  // Ortak form state
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');

  // Bakici ozel form state
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [bio, setBio] = useState('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('pawcarer_token');
    const storedUser = localStorage.getItem('pawcarer_user');

    if (!storedToken || !storedUser) {
      router.push('/login');
      return;
    }

    setToken(storedToken);
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setFullName(parsedUser.fullName || '');
    setLocation(parsedUser.location || '');
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const resUser = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, location })
      });

      if (!resUser.ok) throw new Error('Kullanıcı bilgileri güncellenemedi.');

      if (user?.role === 'SITTER') {
        const resSitter = await fetch('/api/sitters/profile', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            hourlyRate: hourlyRate === '' ? undefined : Number(hourlyRate), 
            bio 
          })
        });

        if (!resSitter.ok) throw new Error('Bakıcı detayları güncellenemedi.');
      }

      setMessage('Profiliniz başarıyla güncellendi! 🎉');
      
      const updatedUser = { ...user, fullName, location };
      localStorage.setItem('pawcarer_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

    } catch (err: any) {
      setMessage(`Hata: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pawcarer_token');
    localStorage.removeItem('pawcarer_user');
    router.push('/login');
  };

  if (!user) return <div className="text-center py-20">Yükleniyor...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 animate-slide-up">
      <div className="glass-panel p-8">
        <div className="flex justify-between items-center mb-8 border-b border-[rgba(139,90,43,0.1)] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#8B5A2B]">Hesabım</h1>
            <p className="text-[#857D77] mt-1">Merhaba <b>{user.fullName}</b>, profilinize hoş geldiniz.</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${user.role === 'SITTER' ? 'bg-[#79B851] text-white' : 'bg-[#2F79A8] text-white'}`}>
              Rol: {user.role === 'SITTER' ? 'BAKICI KONTROL PANELİ' : 'HAYVAN SAHİBİ'}
            </span>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors">
            Çıkış Yap
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes('Hata') ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#dcfce7] text-[#166534]'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#3A3029] mb-1">Ad Soyad</label>
              <input className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3A3029] mb-1">Şehir / Lokasyon</label>
              <input className="input-field" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Şehir bilginiz..." />
            </div>
          </div>

          {user.role === 'SITTER' && (
            <div className="mt-8 pt-8 border-t border-[rgba(139,90,43,0.1)]">
              <h3 className="text-xl font-bold text-[#F47B20] mb-4">Profesyonel Bakıcı Detayları</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#3A3029] mb-1">Saatlik Ücret (TL)</label>
                  <input type="number" className="input-field w-full md:w-1/2" placeholder="Örn: 200" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#3A3029] mb-1">Hakkımda (Biyografi)</label>
                  <textarea rows={4} className="input-field resize-none" placeholder="Kendinizden ve minik dostlarla aranızdaki bağdan bahsedin..." value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 text-right">
            <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto px-8">
              {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
