"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('pawcarer_user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'ADMIN') {
      setMessage('Erişim Reddedildi: Yalnızca yöneticiler bu sayfayı görebilir.');
      setIsAdmin(false);
    } else {
      setIsAdmin(true);
    }
  }, [router]);

  const handleDeleteUser = async () => {
    if(!targetUserId) return;
    
    if(!window.confirm('Bu kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz?')) {
      return;
    }

    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('pawcarer_token');

    try {
      const res = await fetch(`/api/admin/users/${targetUserId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'Kullanıcı silinemedi.');
      }

      setMessage(`Başarılı! ${targetUserId} ID'li kullanıcı sistemden kalıcı olarak silindi.`);
      setTargetUserId('');

    } catch (err: any) {
      setMessage(`Hata: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="bg-[#fee2e2] text-[#b91c1c] p-6 rounded-xl border border-[#f87171] text-center w-full max-w-lg shadow-lg">
          <div className="text-4xl mb-4">⛔️</div>
          <h2 className="text-xl font-bold mb-2">Erişim Reddedildi</h2>
          <p>{message || 'Yönetici yetkiniz bulunmuyor.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 animate-slide-up">
      <div className="glass-panel p-8 border-t-4 border-red-500">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
            🛡️
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#3A3029]">Admin Kontrol Paneli</h1>
            <p className="text-[#857D77] text-sm">Platformdan kural ihlali yapan kullanıcıları uzaklaştırın.</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes('Hata') ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#dcfce7] text-[#166534]'}`}>
            {message}
          </div>
        )}

        <div className="bg-white/50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-[#8B5A2B] mb-4">Kullanıcı Silme Aracı</h3>
          <p className="text-sm text-gray-600 mb-6">Silinecek kullanıcının veritabanı ID numarasını giriniz. Bu işlem geri alınamaz.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              className="input-field flex-1 border-red-200 focus:border-red-500 shadow-sm" 
              placeholder="Örn: 98f13708-2101-11e9-ab14-d663bd873d93"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
            />
            <button 
              onClick={handleDeleteUser}
              disabled={loading || !targetUserId} 
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? 'Siliniyor...' : 'Hesabı Yok Et'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
