"use client"

import { useState } from "react";

export default function AdminDashboardPage() {
  const [targetUserId, setTargetUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("OWNER");
  const [targetReviewId, setTargetReviewId] = useState("");
  const [targetSitterId, setTargetSitterId] = useState("");
  const [message, setMessage] = useState<{type: 'error'|'success', text: string} | null>(null);

  const handleRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeAdminAction(`/api/admin/users/${targetUserId}/role`, "PUT", { role: selectedRole });
  };

  const handleDeleteReview = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeAdminAction(`/api/admin/reviews/${targetReviewId}`, "DELETE");
  };

  const handleDeleteSitter = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeAdminAction(`/api/admin/sitters/${targetSitterId}`, "DELETE");
  };

  const executeAdminAction = async (endpoint: string, method: string, bodyObj?: any) => {
    setMessage(null);
    try {
      const token = localStorage.getItem("token"); // Admin tokeni olmali
      if (!token) throw new Error("Oturum bulunamadı. Admin olarak giriş yapın.");

      const options: RequestInit = {
        method,
        headers: { "Authorization": `Bearer ${token}` }
      };

      if (bodyObj) {
        options.headers = { ...options.headers, "Content-Type": "application/json" };
        options.body = JSON.stringify(bodyObj);
      }

      const res = await fetch(endpoint, options);
      if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.error || "İşlem yetkisiz veya başarısız.");
      }

      setMessage({ type: 'success', text: "Aksiyon başarıyla gerçekleştirildi!" });
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 md:p-8">
      <div className="max-w-4xl w-full mx-auto space-y-6">
        
        <header className="mb-10 text-center md:text-left flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Kontrol Merkezi</h1>
            <p className="text-gray-500 mt-1">Sistem yetkilendirme ve içerik temizleme modülleri.</p>
          </div>
          <div className="hidden md:flex bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-sm">
            🛡️ ADMIN YETKİSİ GEREKTİRİR
          </div>
        </header>

        {message && (
          <div className={`p-4 rounded-xl font-medium border ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* ROL DEĞİŞTİRME KARTI */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Rol Güncelleme</h2>
            <p className="text-sm text-gray-500 mb-5">Bir kullanıcının platformdaki yetki sınırlarını değiştirin.</p>
            
            <form onSubmit={handleRoleChange} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Kullanıcı ID</label>
                <input 
                  type="text" 
                  required
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" 
                  placeholder="örn: 123e4567-e89b..." 
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Yeni Rol</label>
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="OWNER">OWNER (Normal Kullanıcı)</option>
                  <option value="SITTER">SITTER (Bakıcı)</option>
                  <option value="ADMIN">ADMIN (Yönetici)</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">Ayarla</button>
            </form>
          </section>

          {/* İÇERİK SİLME KARTLARI */}
          <div className="space-y-6">
            
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-1"><span className="text-red-500">Uygunsuz Yorum</span> Silme</h2>
              <form onSubmit={handleDeleteReview} className="mt-4 flex flex-col gap-3">
                <input 
                  type="text" 
                  required
                  value={targetReviewId}
                  onChange={(e) => setTargetReviewId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500" 
                  placeholder="Yorum ID girin..." 
                />
                <button type="submit" className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors">Tümüyle Sil</button>
              </form>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-1"><span className="text-red-500">Sistemsel Bakıcı</span> İptali</h2>
              <form onSubmit={handleDeleteSitter} className="mt-4 flex flex-col gap-3">
                <input 
                  type="text" 
                  required
                  value={targetSitterId}
                  onChange={(e) => setTargetSitterId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500" 
                  placeholder="Sitter Profil ID girin..." 
                />
                <button type="submit" className="w-full py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-colors">Profili Kapat & Sil</button>
              </form>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
