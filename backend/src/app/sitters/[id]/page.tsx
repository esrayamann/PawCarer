"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const PET_ICON: Record<string, string> = {
  Kedi: "🐱", Köpek: "🐶", Kuş: "🦜", Tavşan: "🐰", Balık: "🐟", Diğer: "🐾",
};

type Review = {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
};

type SitterDetail = {
  id: string;
  userId: string;
  fullName: string;
  location: string;
  hourlyRate: number;
  acceptedPetTypes: string[];
  acceptedPetBreeds: string[];
  bio: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
};

export default function SitterProfilePage() {
  const params = useParams();
  const router = useRouter();
  const sitterId = params?.id as string;

  const [sitter, setSitter] = useState<SitterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Yorum formu
  const [token, setToken] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewMsg, setReviewMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [reviewSaving, setReviewSaving] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("pawcarer_token") || "");
    fetchSitter();
  }, [sitterId]);

  const fetchSitter = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sitters/${sitterId}`);
      if (res.status === 404) { setNotFound(true); return; }
      if (!res.ok) throw new Error();
      setSitter(await res.json());
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setReviewMsg({ type: "error", text: "Yorum yapabilmek için giriş yapmanız gerekiyor." });
      return;
    }
    setReviewSaving(true);
    setReviewMsg(null);
    try {
      const res = await fetch(`/api/sitters/${sitterId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: reviewForm.rating, comment: reviewForm.comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Yorum gönderilemedi.");
      setReviewMsg({ type: "success", text: "Yorumunuz başarıyla gönderildi! ⭐" });
      setReviewForm({ rating: 5, comment: "" });
      fetchSitter(); // Yorumları yenile
    } catch (err: any) {
      setReviewMsg({ type: "error", text: err.message });
    } finally {
      setReviewSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-pulse">
        <div className="bg-white rounded-3xl p-8 border border-gray-100">
          <div className="flex gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/5" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !sitter) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-[#8B5A2B] mb-2">Bakıcı Bulunamadı</h1>
        <p className="text-[#857D77] mb-6">Bu profil mevcut değil veya silinmiş olabilir.</p>
        <button onClick={() => router.back()} className="px-6 py-2.5 bg-[#F47B20] text-white rounded-xl font-semibold">
          ← Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Geri Butonu */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[#857D77] hover:text-[#F47B20] transition-colors mb-6 font-medium"
      >
        ← Arama Sonuçlarına Dön
      </button>

      {/* Bakıcı Başlık Kartı */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-[#FFF8F2] to-[#FFEEDD] px-8 py-6 border-b border-[rgba(244,123,32,0.1)]">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F47B20] to-amber-400 text-white flex items-center justify-center font-black text-3xl shrink-0 shadow-lg shadow-orange-200">
              {sitter.fullName?.charAt(0) || "?"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#3A3029] mb-1">{sitter.fullName}</h1>
              <p className="text-[#857D77] text-sm flex items-center gap-1 mb-3">
                📍 {sitter.location || "Konum belirtilmemiş"}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-600 px-3 py-1.5 rounded-full text-sm font-bold">
                  ★ {sitter.averageRating || "—"} <span className="font-normal text-amber-500">({sitter.totalReviews} yorum)</span>
                </span>
                <span className="flex items-center gap-1 bg-[#FFF8F2] border border-[rgba(244,123,32,0.2)] text-[#F47B20] px-3 py-1.5 rounded-full text-sm font-bold">
                  ₺{sitter.hourlyRate || "—"} <span className="font-normal">/saat</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Biyografi */}
          {sitter.bio && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-[#3A3029] uppercase mb-2 tracking-wider">Hakkında</h2>
              <p className="text-[#857D77] leading-relaxed">{sitter.bio}</p>
            </div>
          )}

          {/* Kabul Edilen Hayvan Türleri */}
          {sitter.acceptedPetTypes?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-[#3A3029] uppercase mb-3 tracking-wider">Baktığı Hayvan Türleri</h2>
              <div className="flex flex-wrap gap-2">
                {sitter.acceptedPetTypes.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 bg-[#FFF8F2] border border-[rgba(244,123,32,0.2)] text-[#F47B20] px-4 py-2 rounded-full text-sm font-semibold">
                    {PET_ICON[t] || "🐾"} {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Kabul Edilen Cinsler */}
          {sitter.acceptedPetBreeds?.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-[#3A3029] uppercase mb-3 tracking-wider">Uzman Olduğu Cinsler</h2>
              <div className="flex flex-wrap gap-2">
                {sitter.acceptedPetBreeds.map((b) => (
                  <span key={b} className="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Yorum Yazma Formu */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-6">
        <h2 className="text-xl font-bold text-[#8B5A2B] mb-5">⭐ Yorum Bırak</h2>

        {reviewMsg && (
          <div className={`mb-4 p-4 rounded-xl text-sm font-medium ${
            reviewMsg.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
          }`}>
            {reviewMsg.text}
          </div>
        )}

        <form onSubmit={submitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#3A3029] mb-2">Puanınız</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setReviewForm((p) => ({ ...p, rating: n }))}
                  className={`text-3xl transition-transform hover:scale-110 ${n <= reviewForm.rating ? "text-amber-400" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#3A3029] mb-2">Yorumunuz</label>
            <textarea
              rows={4}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
              placeholder="Bu bakıcıyla deneyiminizi paylaşın..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F47B20] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={reviewSaving}
            className="w-full py-3 bg-[#F47B20] hover:bg-[#d96a15] text-white font-bold rounded-2xl transition-colors disabled:opacity-60"
          >
            {reviewSaving ? "Gönderiliyor..." : token ? "Yorum Gönder" : "Yorum için giriş yapın"}
          </button>
        </form>
      </div>

      {/* Yorumlar Listesi */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-[#8B5A2B] mb-6">
          💬 Tüm Yorumlar <span className="text-base font-normal text-[#857D77]">({sitter.totalReviews})</span>
        </h2>

        {sitter.reviews.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-2">✨</div>
            <p className="text-[#857D77]">Henüz yorum yok. İlk yorumu siz yazın!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sitter.reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-[#3A3029] text-sm">{r.reviewerName}</span>
                  <span className="text-amber-500 font-bold text-sm">
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </span>
                </div>
                {r.comment && (
                  <p className="text-[#857D77] text-sm leading-relaxed">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
