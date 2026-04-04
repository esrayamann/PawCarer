"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Gereksinim 7: Rol güncelleme
  const [targetUserId, setTargetUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("OWNER");

  // Gereksinim 5: Yorum silme
  const [targetReviewId, setTargetReviewId] = useState("");

  // Gereksinim 6: Bakıcı silme
  const [targetSitterId, setTargetSitterId] = useState("");

  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("pawcarer_token") || "";
    setToken(t);
    if (!t) {
      setIsAdmin(false);
      return;
    }
    // Token'dan role kontrolü (basit JWT decode)
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      setIsAdmin(payload.role === "ADMIN");
    } catch {
      setIsAdmin(false);
    }
  }, []);

  const executeAdminAction = async (endpoint: string, method: string, bodyObj?: Record<string, unknown>) => {
    setMessage(null);
    setLoadingAction(true);
    try {
      const options: RequestInit = {
        method,
        headers: { Authorization: `Bearer ${token}` } as Record<string, string>,
      };

      if (bodyObj) {
        (options.headers as Record<string, string>)["Content-Type"] = "application/json";
        options.body = JSON.stringify(bodyObj);
      }

      const res = await fetch(endpoint, options);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "İşlem başarısız veya yetkisiz.");

      setMessage({ type: "success", text: "İşlem başarıyla gerçekleştirildi! ✅" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRoleChange = (e: React.FormEvent) => {
    e.preventDefault();
    executeAdminAction(`/api/admin/users/${targetUserId}/role`, "PUT", { role: selectedRole });
  };

  const handleDeleteReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Bu yorumu kalıcı olarak silmek istediğinize emin misiniz?")) return;
    executeAdminAction(`/api/admin/reviews/${targetReviewId}`, "DELETE");
  };

  const handleDeleteSitter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Bu bakıcıyı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    executeAdminAction(`/api/admin/sitters/${targetSitterId}`, "DELETE");
  };

  if (isAdmin === null) {
    return <div className="text-center py-20 text-[#857D77]">Yükleniyor...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-[#8B5A2B] mb-2">Erişim Reddedildi</h1>
        <p className="text-[#857D77] mb-6">Bu sayfaya sadece yöneticiler (ADMIN) erişebilir.</p>
        <button onClick={() => router.push("/profile")} className="px-6 py-2 bg-[#F47B20] text-white rounded-xl font-semibold">
          Profile Dön
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#8B5A2B]">🛡️ Admin Paneli</h1>
          <p className="text-[#857D77] mt-1">Sistem yönetimi ve içerik denetim araçları.</p>
        </div>
        <span className="hidden md:flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl font-bold text-sm">
          🔴 YÖNETİCİ YETKİSİ
        </span>
      </div>

      {/* Global Mesaj */}
      {message && (
        <div className={`mb-6 p-4 rounded-2xl text-sm font-medium border ${
          message.type === "error"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-green-50 text-green-700 border-green-200"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Gereksinim 7: Rol Yetkilendirme */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg">👤</span>
              <div>
                <h2 className="font-bold text-gray-800">Kullanıcı Rol Güncelleme</h2>
                <p className="text-xs text-gray-500">Gereksinim #7 — PUT /admin/users/:id/role</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleRoleChange} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#3A3029] uppercase mb-1">Kullanıcı ID</label>
              <input
                type="text"
                required
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Kullanıcı UUID'si..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3A3029] uppercase mb-1">Yeni Rol</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="OWNER">OWNER — Hayvan Sahibi</option>
                <option value="SITTER">SITTER — Bakıcı</option>
                <option value="ADMIN">ADMIN — Yönetici</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loadingAction}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-60"
            >
              {loadingAction ? "İşleniyor..." : "Rolü Güncelle"}
            </button>
          </form>
        </section>

        <div className="space-y-6">
          {/* Gereksinim 5: Yorum Silme */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-lg">🗑️</span>
                <div>
                  <h2 className="font-bold text-gray-800">Yorum Silme</h2>
                  <p className="text-xs text-gray-500">Gereksinim #5 — DELETE /admin/reviews/:id</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleDeleteReview} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3A3029] uppercase mb-1">Yorum ID</label>
                <input
                  type="text"
                  required
                  value={targetReviewId}
                  onChange={(e) => setTargetReviewId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="Silinecek yorum UUID'si..."
                />
              </div>
              <button
                type="submit"
                disabled={loadingAction}
                className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                {loadingAction ? "Siliniyor..." : "Yorumu Sil"}
              </button>
            </form>
          </section>

          {/* Gereksinim 6: Bakıcı Silme */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-900 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-lg">⛔</span>
                <div>
                  <h2 className="font-bold text-white">Bakıcı Hesabı Silme</h2>
                  <p className="text-xs text-gray-400">Gereksinim #6 — DELETE /admin/sitters/:id</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleDeleteSitter} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3A3029] uppercase mb-1">Bakıcı Profil ID</label>
                <input
                  type="text"
                  required
                  value={targetSitterId}
                  onChange={(e) => setTargetSitterId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Silinecek bakıcı UUID'si..."
                />
              </div>
              <button
                type="submit"
                disabled={loadingAction}
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                {loadingAction ? "Siliniyor..." : "Bakıcıyı Kalıcı Sil"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
