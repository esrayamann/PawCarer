import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-3xl shadow-xs border border-gray-100 text-center">
        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
          🐾
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">PawCarer Projesine Hoşgeldiniz</h1>
        <p className="text-gray-500 mb-8">Henüz anasayfa tasarlanmamıştır. Hazırlanan sayfalara aşağıdaki sekmelerden hızlıca ulaşabilirsiniz:</p>
        
        <div className="flex flex-col gap-4">
          <Link href="/search" className="py-4 px-6 bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium rounded-xl transition-colors">
            🔍 Gelişmiş Bakıcı Arama Sayfası (/search)
          </Link>
          <Link href="/pets/new" className="py-4 px-6 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium rounded-xl transition-colors">
            🐱 Evcil Hayvan Ekleme Sayfası (/pets/new)
          </Link>
          <Link href="/admin" className="py-4 px-6 bg-red-50 text-red-700 hover:bg-red-100 font-medium rounded-xl transition-colors">
            🛡️ Admin Kontrol Paneli (/admin)
          </Link>
        </div>
      </div>
    </div>
  );
}
