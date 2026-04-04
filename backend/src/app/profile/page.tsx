"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Pet {
  id: string;
  name: string;
  petType: string;
  breed: string;
  age?: number;
  notes?: string;
}

const ALL_PET_TYPES = ['Kedi', 'Köpek', 'Kuş', 'Tavşan', 'Balık', 'Diğer'];
const PET_ICON: Record<string, string> = {
  Kedi: '🐱', Köpek: '🐶', Kuş: '🦜', Tavşan: '🐰', Balık: '🐟', Diğer: '🐾',
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');

  // Profil form state
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');

  // Bakıcı özel form state
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [bio, setBio] = useState('');
  const [acceptedPetTypes, setAcceptedPetTypes] = useState<string[]>([]);
  const [acceptedPetBreeds, setAcceptedPetBreeds] = useState<string>('');

  // Pet form state (OWNER)
  const [pets, setPets] = useState<Pet[]>([]);
  const [showPetForm, setShowPetForm] = useState(false);
  const [petLoading, setPetLoading] = useState(false);
  const [petMessage, setPetMessage] = useState('');
  const [petForm, setPetForm] = useState({
    name: '', petType: 'Kedi', breed: '', age: '', notes: '',
  });

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

    if (parsedUser.role === 'OWNER') fetchPets(storedToken);
  }, [router]);

  const fetchPets = async (tkn: string) => {
    try {
      const res = await fetch('/api/pets', { headers: { 'Authorization': `Bearer ${tkn}` } });
      if (res.ok) setPets(await res.json());
    } catch (_) {}
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const resUser = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ fullName, location })
      });
      if (!resUser.ok) throw new Error('Kullanıcı bilgileri güncellenemedi.');

      if (user?.role === 'SITTER') {
        const resSitter = await fetch('/api/sitters/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            hourlyRate: hourlyRate === '' ? undefined : Number(hourlyRate),
            bio,
            acceptedPetTypes,
            acceptedPetBreeds: acceptedPetBreeds
              ? acceptedPetBreeds.split(',').map((s: string) => s.trim()).filter(Boolean)
              : []
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

  const handlePetFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setPetForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    setPetLoading(true);
    setPetMessage('');
    try {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: petForm.name, petType: petForm.petType, breed: petForm.breed,
          age: petForm.age ? parseInt(petForm.age) : undefined,
          notes: petForm.notes || undefined,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu.');
      setPets(prev => [...prev, data]);
      setPetForm({ name: '', petType: 'Kedi', breed: '', age: '', notes: '' });
      setShowPetForm(false);
      setPetMessage('Evcil hayvan profili başarıyla oluşturuldu! 🐾');
      setTimeout(() => setPetMessage(''), 4000);
    } catch (err: any) {
      setPetMessage(`Hata: ${err.message}`);
    } finally {
      setPetLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pawcarer_token');
    localStorage.removeItem('pawcarer_user');
    router.push('/login');
  };

  const togglePetType = (t: string) => {
    setAcceptedPetTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  if (!user) return <div className="text-center py-20">Yükleniyor...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 animate-slide-up">
      <div className="glass-panel p-8">

        {/* Header */}
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

        {/* Mesaj */}
        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes('Hata') ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#dcfce7] text-[#166534]'}`}>
            {message}
          </div>
        )}

        {/* Profil Güncelleme Formu */}
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

          {/* SITTER ek alanları */}
          {user.role === 'SITTER' && (
            <div className="mt-8 pt-8 border-t border-[rgba(139,90,43,0.1)]">
              <h3 className="text-xl font-bold text-[#F47B20] mb-5">Profesyonel Bakıcı Detayları</h3>
              <div className="space-y-6">

                <div>
                  <label className="block text-sm font-semibold text-[#3A3029] mb-1">Saatlik Ücret (TL)</label>
                  <input type="number" className="input-field w-full md:w-1/2" placeholder="Örn: 200" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3A3029] mb-1">Hakkımda (Biyografi)</label>
                  <textarea rows={4} className="input-field resize-none" placeholder="Kendinizden ve minik dostlarla aranızdaki bağdan bahsedin..." value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                </div>

                {/* Kabul Edilen Hayvan Türleri */}
                <div>
                  <label className="block text-sm font-semibold text-[#3A3029] mb-3">Baktığım Hayvan Türleri</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ALL_PET_TYPES.map((t) => (
                      <label key={t} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none ${acceptedPetTypes.includes(t) ? 'bg-[#FFF8F2] border-[#F47B20] text-[#F47B20]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        <input type="checkbox" className="hidden" checked={acceptedPetTypes.includes(t)} onChange={() => togglePetType(t)} />
                        <span className="text-lg">{PET_ICON[t]}</span>
                        <span className="text-sm font-medium">{t}</span>
                        {acceptedPetTypes.includes(t) && <span className="ml-auto text-[#F47B20] text-xs font-bold">✓</span>}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Uzman Cinsler */}
                <div>
                  <label className="block text-sm font-semibold text-[#3A3029] mb-1">
                    Uzman Olduğum Cinsler <span className="font-normal text-[#857D77]">(virgülle ayırın)</span>
                  </label>
                  <input
                    className="input-field"
                    placeholder="Örn: British Shorthair, Labrador, Siyam"
                    value={acceptedPetBreeds}
                    onChange={(e) => setAcceptedPetBreeds(e.target.value)}
                  />
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

        {/* ====================================================
            EVCİL HAYVAN PROFİLİ — Sadece OWNER rolü için
        ===================================================== */}
        {user.role === 'OWNER' && (
          <div className="mt-10 pt-8 border-t border-[rgba(139,90,43,0.15)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#8B5A2B]">🐾 Evcil Hayvanlarım</h2>
                <p className="text-[#857D77] text-sm mt-1">Kayıtlı tüm evcil hayvan profilleriniz</p>
              </div>
              <button
                onClick={() => { setShowPetForm(!showPetForm); setPetMessage(''); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#F47B20] hover:bg-[#d96a15] text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-orange-200"
              >
                {showPetForm ? '✕ İptal' : '＋ Yeni Profil Ekle'}
              </button>
            </div>

            {petMessage && (
              <div className={`p-4 rounded-xl mb-5 text-sm font-medium ${petMessage.includes('Hata') ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#dcfce7] text-[#166534]'}`}>
                {petMessage}
              </div>
            )}

            {showPetForm && (
              <form onSubmit={handleAddPet} className="bg-[#FFF8F2] border border-[rgba(244,123,32,0.2)] rounded-2xl p-6 mb-6 space-y-4">
                <h3 className="text-lg font-bold text-[#F47B20] mb-2">Yeni Evcil Hayvan Profili</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3A3029] mb-1">Adı <span className="text-red-500">*</span></label>
                    <input name="name" required value={petForm.name} onChange={handlePetFormChange} placeholder="Örn: Mia" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#3A3029] mb-1">Türü <span className="text-red-500">*</span></label>
                    <select name="petType" value={petForm.petType} onChange={handlePetFormChange} className="input-field">
                      {ALL_PET_TYPES.map(t => <option key={t} value={t}>{PET_ICON[t]} {t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3A3029] mb-1">Cinsi <span className="text-red-500">*</span></label>
                    <input name="breed" required value={petForm.breed} onChange={handlePetFormChange} placeholder="Örn: British Shorthair" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#3A3029] mb-1">Yaşı</label>
                    <input name="age" type="number" min="0" value={petForm.age} onChange={handlePetFormChange} placeholder="Örn: 2" className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3A3029] mb-1">Özel Notlar</label>
                  <textarea name="notes" rows={3} value={petForm.notes} onChange={handlePetFormChange} placeholder="Alerjileri, sevdiği şeyler..." className="input-field resize-none"></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={petLoading} className="btn-primary px-8 flex items-center gap-2">
                    {petLoading ? 'Kaydediliyor...' : '🐾 Profili Oluştur'}
                  </button>
                  <button type="button" onClick={() => setShowPetForm(false)} className="px-6 py-2 rounded-xl border border-[rgba(139,90,43,0.2)] text-[#857D77] hover:bg-gray-50 transition-colors">
                    İptal
                  </button>
                </div>
              </form>
            )}

            {pets.length === 0 ? (
              <div className="text-center py-10 bg-[#FFF8F2] rounded-2xl border border-dashed border-[rgba(244,123,32,0.3)]">
                <div className="text-5xl mb-3">🐾</div>
                <p className="text-[#857D77] font-medium">Henüz kayıtlı evcil hayvanınız yok.</p>
                <p className="text-[#857D77] text-sm">Yukarıdaki butona tıklayarak ilk profilinizi oluşturun!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pets.map((pet) => (
                  <div key={pet.id} className="bg-[#FFF8F2] border border-[rgba(244,123,32,0.15)] rounded-2xl p-5 hover:shadow-md hover:shadow-orange-100 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{PET_ICON[pet.petType] || '🐾'}</span>
                      <div>
                        <h4 className="font-bold text-[#3A3029] text-lg">{pet.name}</h4>
                        <p className="text-sm text-[#F47B20] font-medium">{pet.petType} · {pet.breed}</p>
                      </div>
                    </div>
                    {pet.age !== undefined && pet.age !== null && (
                      <p className="text-sm text-[#857D77]">🎂 {pet.age} yaşında</p>
                    )}
                    {pet.notes && (
                      <p className="text-sm text-[#857D77] mt-1 italic">"{pet.notes}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
