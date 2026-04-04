"use client";

import { useState, useEffect } from "react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  sitterId: string;
  sitter?: { user?: { fullName?: string } };
};

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("pawcarer_token") || "";
    setToken(t);
    if (t) fetchReviews(t);
    else setLoading(false);
  }, []);

  const fetchReviews = async (tkn: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews/my", {
        headers: { Authorization: `Bearer ${tkn}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (_) {}
    finally { setLoading(false); }
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditForm({ rating: review.rating, comment: review.comment || "" });
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setMessage(null);
  };

  const handleUpdate = async (reviewId: string) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: editForm.rating, comment: editForm.comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Güncelleme başarısız.");

      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, ...data } : r))
      );
      setEditingId(null);
      setMessage({ type: "success", text: "Yorumunuz başarıyla güncellendi! ✅" });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const stars = (count: number, selected: number, onClick?: (n: number) => void) =>
    [1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onClick && onClick(n)}
        className={`text-2xl transition-transform ${onClick ? "hover:scale-110 cursor-pointer" : "cursor-default"} ${n <= (onClick ? selected : count) ? "text-amber-400" : "text-gray-300"}`}
      >
        ★
      </button>
    ));

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-[#8B5A2B] mb-2">⭐ Yorumlarım</h1>
      <p className="text-[#857D77] mb-8">Daha önce bıraktığınız yorumları görüntüleyin ve güncelleyin.</p>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {message.text}
        </div>
      )}

      {!token ? (
        <div className="text-center py-16 bg-[#FFF8F2] rounded-2xl border border-dashed border-[rgba(244,123,32,0.3)]">
          <p className="text-[#857D77] font-medium">Yorumlarınızı görmek için giriş yapmanız gerekiyor.</p>
          <a href="/login" className="mt-4 inline-block px-6 py-2 bg-[#F47B20] text-white rounded-xl font-semibold">
            Giriş Yap
          </a>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-[#FFF8F2] rounded-2xl border border-dashed border-[rgba(244,123,32,0.3)]">
          <div className="text-5xl mb-3">💬</div>
          <p className="text-[#857D77] font-medium">Henüz yorum bırakmadınız.</p>
          <a href="/search" className="mt-4 inline-block px-6 py-2 bg-[#F47B20] text-white rounded-xl font-semibold">
            Bakıcı Bul
          </a>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-semibold text-[#857D77] uppercase mb-1">Bakıcıya Verilen Yorum</p>
                    <div className="flex gap-0.5">
                      {stars(review.rating, review.rating)}
                    </div>
                  </div>
                  {editingId !== review.id && (
                    <button
                      onClick={() => startEdit(review)}
                      className="px-4 py-1.5 bg-[#FFF8F2] border border-[rgba(244,123,32,0.3)] text-[#F47B20] text-sm font-semibold rounded-lg hover:bg-[#FFEEDD] transition-colors"
                    >
                      ✏️ Düzenle
                    </button>
                  )}
                </div>
                <p className="text-[#3A3029] text-sm leading-relaxed">
                  {review.comment || <span className="italic text-[#857D77]">Yorum metni yok.</span>}
                </p>
              </div>

              {editingId === review.id && (
                <div className="border-t border-[rgba(244,123,32,0.1)] bg-[#FFF8F2] p-6 space-y-4">
                  <h3 className="font-bold text-[#F47B20] text-sm uppercase">Yorumu Güncelle</h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#3A3029] mb-2">Yeni Puan</label>
                    <div className="flex gap-1">
                      {stars(editForm.rating, editForm.rating, (n) =>
                        setEditForm((p) => ({ ...p, rating: n }))
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3A3029] mb-1">Yorum Metni</label>
                    <textarea
                      rows={3}
                      value={editForm.comment}
                      onChange={(e) => setEditForm((p) => ({ ...p, comment: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-[rgba(244,123,32,0.2)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F47B20] resize-none"
                      placeholder="Deneyiminizi paylaşın..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdate(review.id)}
                      disabled={saving}
                      className="px-6 py-2 bg-[#F47B20] hover:bg-[#d96a15] text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60"
                    >
                      {saving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-6 py-2 bg-white border border-gray-200 text-[#857D77] font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
