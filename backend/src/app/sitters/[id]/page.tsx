"use client";

import { useEffect, useState, use } from 'react';

export default function SitterDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const sitterId = resolvedParams.id;

  const [ratingData, setRatingData] = useState<{ averageRating: number, totalReviews: number } | null>(null);
  
  // Review form state
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Sitter in yildiz ortalamasini cek
    fetch(`/api/sitters/${sitterId}/rating`)
      .then(res => res.json())
      .then(data => {
        if(data.averageRating !== undefined) {
          setRatingData(data);
        }
      })
      .catch(err => console.error("Rating cekilemedi", err));
  }, [sitterId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('pawcarer_token');
    if(!token) {
      setMessage('Hata: Yorum yapabilmek için lütfen önce giriş yapın.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sitterId,
          rating,
          comment
        })
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'Yorum gönderilemedi.');
      }

      setMessage('Yorumunuz başarıyla eklendi! Teşekkürler.');
      setComment('');
      
      // Update rating data visually
      fetch(`/api/sitters/${sitterId}/rating`)
        .then(res => res.json())
        .then(data => setRatingData(data));

    } catch (err: any) {
      setMessage(`Hata: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 animate-slide-up">
      {/* Sitter Header Profile */}
      <div className="glass-panel p-8 mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F47B20] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-32 h-32 bg-[#8B5A2B] rounded-full flex justify-center items-center text-5xl flex-shrink-0 shadow-lg text-white border-4 border-white">
            👱‍♀️
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#3A3029]">Harika Bakıcı Profili</h1>
            <p className="text-[#8B5A2B] font-medium mt-1">İstanbul, Türkiye</p>
            
            {/* Yildiz Ortalamasi */}
            <div className="mt-4 flex items-center gap-3 bg-white/60 px-4 py-2 rounded-full inline-flex">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="font-bold text-[#3A3029] text-lg">
                  {ratingData ? ratingData.averageRating.toFixed(1) : '...'} / 5.0
                </div>
                <div className="text-xs text-[#857D77]">
                  {ratingData ? ratingData.totalReviews : 0} Değerlendirme
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission Section */}
      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold text-[#8B5A2B] mb-6 border-b border-[rgba(139,90,43,0.1)] pb-4">Deneyiminizi Puanlayın</h2>
        
        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes('Hata') ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#dcfce7] text-[#166534]'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#3A3029] mb-3">Bakıcıya Kaç Yıldız Verirsiniz?</label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-12 h-12 rounded-full flex justify-center items-center text-xl transition-all ${rating >= star ? 'bg-[#F47B20] text-white shadow-md transform scale-110' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#3A3029] mb-1">Yorumunuz</label>
            <textarea 
              required
              rows={4} 
              className="input-field resize-none bg-white/80" 
              placeholder="Bakıcıyla olan tecrübenizi 1-2 cümle ile anlatın, diğer hayvan sahiplerine yardımcı olun..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Gönderiliyor...' : 'Yorumu Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
