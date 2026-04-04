"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    petType: "Kedi",
    breed: "",
    age: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Lütfen önce sisteme giriş yapın.");
      }

      const res = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/search"); // Başarılıysa search sayfasına at
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-900/5 p-8 border border-white/50">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-600 mb-2">
            Pati Ekle
          </h1>
          <p className="text-gray-500 text-sm">Dostunun profilini oluştur ve bakıcı bulmaya başla!</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-50 text-emerald-600 text-sm p-4 rounded-xl border border-emerald-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Profil başarıyla oluşturuldu! Yönlendiriliyorsunuz...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dostunun Adı</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
              placeholder="Örn: Mia"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Türü</label>
              <select 
                name="petType"
                value={formData.petType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none appearance-none"
              >
                <option value="Kedi">Kedi 🐱</option>
                <option value="Köpek">Köpek 🐶</option>
                <option value="Kuş">Kuş 🦜</option>
                <option value="Tavşan">Tavşan 🐰</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yaşı (Opsiyonel)</label>
              <input 
                type="number" 
                name="age"
                min="0"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="Örn: 2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cinsi</label>
            <input 
              type="text" 
              name="breed"
              required
              value={formData.breed}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none"
              placeholder="Örn: British Shorthair"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Özel Notlar</label>
            <textarea 
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none resize-none"
              placeholder="Alerjileri, sevdiği şeyler vb..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading || success}
            className="w-full py-3.5 px-4 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydediliyor...
              </>
            ) : "Profili Oluştur"}
          </button>
        </form>

      </div>
    </div>
  );
}
