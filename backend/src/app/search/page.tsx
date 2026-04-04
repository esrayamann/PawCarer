"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Sitter = {
  id: string;
  fullName: string;
  location: string;
  hourlyRate: number;
  acceptedPetTypes: string[];
  acceptedPetBreeds: string[];
  bio: string;
  averageRating: number;
  totalReviews: number;
};

const PET_TYPES = ["Kedi", "Köpek", "Kuş", "Tavşan", "Balık", "Diğer"];
const PET_ICON: Record<string, string> = {
  Kedi: "🐱", Köpek: "🐶", Kuş: "🦜", Tavşan: "🐰", Balık: "🐟", Diğer: "🐾",
};

export default function SearchPage() {
  const router = useRouter();
  const [sitters, setSitters] = useState<Sitter[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  // Gereksinim #2 — Konuma göre arama
  const [location, setLocation] = useState("");
  // Gereksinim #3 — Hayvan türüne göre filtreleme
  const [petType, setPetType] = useState("");
  // Gereksinim #4 — Hayvan cinsine göre filtreleme
  const [petBreed, setPetBreed] = useState("");

  // Yorum formu (modal)
  const [reviewTarget, setReviewTarget] = useState<Sitter | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewMsg, setReviewMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [reviewSaving, setReviewSaving] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("pawcarer_token") || "";
    setToken(t);
    fetchSitters({});
    // eslint-disable-next-line
  }, []);

  const fetchSitters = async (params: { location?: string; petType?: string; petBreed?: string }) => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (params.location) q.append("location", params.location);
      if (params.petType) q.append("petType", params.petType);
      if (params.petBreed) q.append("petBreed", params.petBreed);

      const res = await fetch(`/api/sitters?${q.toString()}`);
      if (res.ok) setSitters(await res.json());
    } catch (_) {}
    finally { setLoading(false); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSitters({ location, petType, petBreed });
  };

  const handleReset = () => {
    setLocation(""); setPetType(""); setPetBreed("");
    fetchSitters({});
  };

  const openReview = (sitter: Sitter) => {
    if (!token) { router.push("/login"); return; }
    setReviewTarget(sitter);
    setReviewForm({ rating: 5, comment: "" });
    setReviewMsg(null);
  };

  const submitReview = async () => {
    setReviewSaving(true);
    setReviewMsg(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sitterId: reviewTarget!.id, rating: reviewForm.rating, comment: reviewForm.comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Yorum kaydedilemedi.");
      setReviewMsg({ type: "success", text: "Yorumunuz başarıyla gönderildi! ⭐" });
      setTimeout(() => setReviewTarget(null), 2000);
    } catch (err: any) {
      setReviewMsg({ type: "error", text: err.message });
    } finally {
      setReviewSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero / Arama */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-[#8B5A2B] mb-1">Mükemmel Bakıcıyı Bul 🐾</h1>
          <p className="text-[#857D77] mb-7">Konuma, türe veya cinse göre filtrele.</p>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Gereksinim #2: Konum */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">📍</span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Şehir veya ilçe..."
                className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F47B20]"
              />
            </div>

            {/* Gereksinim #3: Hayvan Türü */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">🐾</span>
              <select
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#F47B20]"
              >
                <option value="">Tüm Türler</option>
                {PET_TYPES.map((t) => (
                  <option key={t} value={t}>{PET_ICON[t]} {t}</option>
                ))}
              </select>
            </div>

            {/* Gereksinim #4: Hayvan Cinsi */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">🔬</span>
              <input
                type="text"
                value={petBreed}
                onChange={(e) => setPetBreed(e.target.value)}
                placeholder="Cins (Örn: Siyam, Labrador...)"
                className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F47B20]"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-3 bg-[#F47B20] hover:bg-[#d96a15] text-white font-bold rounded-2xl text-sm transition-colors shadow-md shadow-orange-200">
                Ara
              </button>
              {(location || petType || petBreed) && (
                <button type="button" onClick={handleReset} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-2xl text-sm transition-colors">
                  ✕
                </button>
              )}
            </div>
          </form>

          {(location || petType || petBreed) && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {location && <span className="inline-flex items-center gap-1 bg-orange-50 text-[#F47B20] border border-orange-200 px-3 py-1 rounded-full text-xs font-semibold">📍 {location}</span>}
              {petType && <span className="inline-flex items-center gap-1 bg-orange-50 text-[#F47B20] border border-orange-200 px-3 py-1 rounded-full text-xs font-semibold">{PET_ICON[petType]} {petType}</span>}
              {petBreed && <span className="inline-flex items-center gap-1 bg-orange-50 text-[#F47B20] border border-orange-200 px-3 py-1 rounded-full text-xs font-semibold">🔬 {petBreed}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Sonuçlar */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 h-64 border border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
                <div className="h-10 bg-gray-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : sitters.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#3A3029] mb-1">Bakıcı Bulunamadı</h3>
            <p className="text-[#857D77]">Farklı filtreler deneyebilirsiniz.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#857D77] mb-5 font-medium">{sitters.length} bakıcı bulundu</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sitters.map((sitter) => (
                <div
                  key={sitter.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-orange-100 transition-all flex flex-col overflow-hidden group cursor-pointer"
                  onClick={() => router.push(`/sitters/${sitter.id}`)}
                >
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F47B20]/20 to-amber-100 text-[#F47B20] flex items-center justify-center font-bold text-xl">
                          {sitter.fullName?.charAt(0) || "?"}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#3A3029] group-hover:text-[#F47B20] transition-colors">{sitter.fullName}</h3>
                          <p className="text-xs text-[#857D77] flex items-center gap-1">
                            📍 {sitter.location || "Konum belirtilmemiş"}
                          </p>
                        </div>
                      </div>
                      <span className="flex items-center gap-0.5 text-sm font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full shrink-0">
                        ★ {sitter.averageRating || "—"}
                      </span>
                    </div>

                    <p className="text-sm text-[#857D77] mb-4 line-clamp-2">
                      {sitter.bio || "Bu bakıcı henüz biyografi girmemiş."}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {sitter.acceptedPetTypes?.map((t) => (
                        <span key={t} className="text-xs bg-[#FFF8F2] text-[#F47B20] border border-[rgba(244,123,32,0.2)] px-2.5 py-0.5 rounded-full font-medium">
                          {PET_ICON[t] || "🐾"} {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="px-6 pb-6 border-t border-gray-50 pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#857D77]">Saatlik</p>
                      <p className="text-lg font-bold text-[#3A3029]">₺{sitter.hourlyRate || "—"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openReview(sitter); }}
                        className="px-3 py-2 bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold rounded-xl hover:bg-amber-100 transition-colors"
                      >
                        ⭐ Yorum
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/sitters/${sitter.id}`); }}
                        className="px-4 py-2 bg-[#F47B20] hover:bg-[#d96a15] text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Profil →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Yorum Modalı */}
      {reviewTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#8B5A2B]">Yorum Bırak</h2>
                <p className="text-sm text-[#857D77]">{reviewTarget.fullName} için değerlendirme</p>
              </div>
              <button onClick={() => setReviewTarget(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">✕</button>
            </div>

            {reviewMsg && (
              <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${reviewMsg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                {reviewMsg.text}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-bold text-[#3A3029] mb-2">Puan</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setReviewForm((p) => ({ ...p, rating: n }))}
                    className={`text-3xl transition-transform hover:scale-110 ${n <= reviewForm.rating ? "text-amber-400" : "text-gray-300"}`}>
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-[#3A3029] mb-2">Yorumunuz</label>
              <textarea rows={4} value={reviewForm.comment}
                onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                placeholder="Bu bakıcıyla deneyiminizi paylaşın..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F47B20] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={submitReview} disabled={reviewSaving}
                className="flex-1 py-3 bg-[#F47B20] hover:bg-[#d96a15] text-white font-bold rounded-2xl transition-colors disabled:opacity-60">
                {reviewSaving ? "Gönderiliyor..." : "Yorumu Gönder"}
              </button>
              <button onClick={() => setReviewTarget(null)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-2xl transition-colors">
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
