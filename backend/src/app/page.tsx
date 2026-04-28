import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[85vh] animate-slide-up">
      
      {/* Hero Section */}
      <section className="text-center py-16 px-4 relative">
        <div className="absolute inset-0 flex justify-center items-center -z-10 overflow-hidden opacity-30">
          <div className="w-96 h-96 bg-[#F47B20] rounded-full blur-[100px] absolute -top-10 -left-20"></div>
          <div className="w-96 h-96 bg-[#79B851] rounded-full blur-[100px] absolute block right-0"></div>
          <div className="w-80 h-80 bg-[#2F79A8] rounded-full blur-[100px] absolute -bottom-20 left-1/3"></div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-[#8B5A2B] tracking-tight mb-4 drop-shadow-sm">
          <span className="text-[#F47B20]">Paw</span>Carer
        </h1>
        <div className="bg-[#2F79A8] text-white inline-block px-6 py-2 rounded-full font-semibold tracking-wide shadow-md mb-8">
          Evcil Hayvan Bakım Platformu
        </div>
        
        <p className="max-w-2xl mx-auto text-lg text-[#857D77] mb-10 leading-relaxed font-medium">
          Dostlarınız için güvenilir bakıcılar bulun veya yeteneklerinizi sergileyerek bakıcılık serüveninize bugün başlayın!
        </p>
      </section>

      {/* Main Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-6xl mx-auto w-full z-10 mb-20">
        
        {/* Hayvan Sahipleri */}
        <div className="glass-panel p-8 flex flex-col items-center text-center transform transition-all hover:-translate-y-2 hover:shadow-xl">
          <div className="text-6xl mb-4">🐶</div>
          <h2 className="text-2xl font-bold text-[#3A3029] mb-2 bg-[#F47B20] text-white px-4 py-1 rounded-full shadow-sm">
            Hayvan Sahipleri
          </h2>
          <p className="text-[#857D77] mb-6 flex-1">
            Evcil hayvan profilinizi oluşturun, konumunuza en uygun bakıcıları listeleyin.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Link href="/register/owner" className="btn-primary w-full shadow-sm">
              Müşteri Olarak Katıl
            </Link>
            <Link href="/sitters" className="px-4 py-2 text-[#F47B20] font-semibold bg-[rgba(244,123,32,0.1)] rounded-full hover:bg-[rgba(244,123,32,0.2)] transition-colors">
              🔍 Konuma Göre Bakıcı Ara
            </Link>
          </div>
        </div>

        {/* Bakıcılar */}
        <div className="glass-panel p-8 flex flex-col items-center text-center transform transition-all hover:-translate-y-2 hover:shadow-xl">
          <div className="text-6xl mb-4">🙋‍♂️</div>
          <h2 className="text-2xl font-bold text-[#3A3029] mb-2 bg-[#2F79A8] text-white px-4 py-1 rounded-full shadow-sm">
            Bakıcılar
          </h2>
          <p className="text-[#857D77] mb-6 flex-1">
            Bakıcı profilinizi oluşturup saatlik ücretinizi belirleyin, can dostlar ile vakit geçirin.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Link href="/register/sitter" className="btn-secondary w-full shadow-sm">
              Bakıcı Profilini Oluştur
            </Link>
            <Link href="/login" className="px-4 py-2 text-[#2F79A8] font-semibold bg-[rgba(47,121,168,0.1)] rounded-full hover:bg-[rgba(47,121,168,0.2)] transition-colors">
              💼 Hesabına Giriş Yap
            </Link>
          </div>
        </div>

        {/* Güvenlik & Admin */}
        <div className="glass-panel p-8 flex flex-col items-center text-center transform transition-all hover:-translate-y-2 hover:shadow-xl md:col-span-2 lg:col-span-1">
          <div className="text-6xl mb-4">🛡️</div>
          <h2 className="text-2xl font-bold text-[#3A3029] mb-2 bg-[#8B5A2B] text-white px-4 py-1 rounded-full shadow-sm">
            Güvenli İletişim
          </h2>
          <p className="text-[#857D77] mb-6 flex-1">
            Moderatör ekibimiz platformu düzenli denetler. Güvenilir ve şeffaf yorum sistemi sunarız.
          </p>
          <div className="flex flex-col gap-3 w-full mt-auto">
            <Link href="/admin/users" className="px-4 py-2 text-[#8B5A2B] font-semibold bg-[rgba(139,90,43,0.1)] rounded-full hover:bg-[rgba(139,90,43,0.2)] border border-[rgba(139,90,43,0.2)] transition-colors">
              ⚙️ Admin Kontrol Paneli
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
