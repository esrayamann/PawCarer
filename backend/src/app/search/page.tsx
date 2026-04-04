"use client"

import { useState, useEffect } from "react";
import Link from 'next/link';

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

export default function SearchPage() {
  const [sitters, setSitters] = useState<Sitter[]>([]);
  const [loading, setLoading] = useState(false);
  
  // URL senkronizasyonu olmasa da UI bazlı state tutalım
  const [searchParams, setSearchParams] = useState({
    location: "",
    petType: "",
    petBreed: ""
  });

  const fetchSitters = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchParams.location) queryParams.append("location", searchParams.location);
      if (searchParams.petType) queryParams.append("petType", searchParams.petType);
      if (searchParams.petBreed) queryParams.append("petBreed", searchParams.petBreed);
      
      const res = await fetch(`/api/sitters?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Veri getirilemedi");
      const data = await res.json();
      setSitters(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde bir kere tüm bakıcıları çek
  useEffect(() => {
    fetchSitters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSitters();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header / Hero Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-8 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mükemmel Bakıcıyı Bul</h1>
          <p className="text-gray-500 mb-8">Dostun için en güvenilir bakıcıları hemen filtrele.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </span>
              <input 
                type="text" 
                name="location"
                value={searchParams.location}
                onChange={handleChange}
                placeholder="Hangi şehir/ilçedesiniz?" 
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="relative md:w-48">
              <select 
                name="petType"
                value={searchParams.petType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
              >
                <option value="">Tümü (Tür)</option>
                <option value="Kedi">Kedi</option>
                <option value="Köpek">Köpek</option>
                <option value="Kuş">Kuş</option>
              </select>
            </div>

            <div className="relative md:w-48">
              <input 
                type="text" 
                name="petBreed"
                value={searchParams.petBreed}
                onChange={handleChange}
                placeholder="Cins (Örn: Siyam)" 
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <button 
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-2xl transition-colors shrink-0 shadow-lg shadow-purple-600/20"
            >
              Ara
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-3xl p-6 h-64 border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : sitters.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4 text-purple-600">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-1">Bakıcı Bulunamadı</h3>
            <p className="text-gray-500">Gösterilecek bir kayıt yok. Lütfen filtreleri değiştirerek tekrar deneyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sitters.map((sitter) => (
              <div key={sitter.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-xl transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 flex items-center justify-center font-bold text-xl ring-2 ring-white">
                      {sitter.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{sitter.fullName}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {sitter.location || "Konum Yok"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full">
                      ★ {sitter.averageRating || "0.0"}
                    </span>
                    <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase">({sitter.totalReviews} Yorum)</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {sitter.bio || "Bu bakıcı henüz bir biyografi girmemiş."}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {sitter.acceptedPetTypes?.map(type => (
                    <span key={type} className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                      {type}
                    </span>
                  ))}
                  {sitter.acceptedPetTypes?.length === 0 && (
                    <span className="text-xs font-medium bg-gray-50 text-gray-400 px-2.5 py-1 rounded-lg">Bilinmiyor</span>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Saatlik Ücret</p>
                    <p className="text-lg font-bold text-gray-900">₺{sitter.hourlyRate || "100"}</p>
                  </div>
                  <button className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors">
                    Detaylar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
