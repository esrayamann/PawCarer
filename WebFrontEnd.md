# Web Frontend Görev Dağılımı

**Web Frontend Adresi:** [paw-carer.vercel.app](https://paw-carer.vercel.app)

Bu dokümanda, web uygulamasının kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) görevleri listelenmektedir. Her grup üyesi, kendisine atanan sayfaların tasarımı, implementasyonu ve kullanıcı etkileşimlerinden sorumludur.

---

## Grup Üyelerinin Web Frontend Görevleri

1. [Ali Tutar'ın Web Frontend Görevleri](Ali-Tutar/Ali-Tutar-Web-Frontend-Gorevleri.md)
2. [Esra Yaman'ın Web Frontend Görevleri](Esra-Yaman/Esra-Yaman-Web-Frontend-Gorevleri.md)
3. [Toprak Yavuz'un Web Frontend Görevleri](Toprak-Yavuz/Toprak-Yavuz-Web-Frontend-Gorevleri.md)



---

## Genel Web Frontend Prensipleri

Bu doküman, hocamızın belirlediği şablon yapıya sadık kalınarak oluşturulmuş olup, projemizde (PawCarer) kullanılan gerçek teknolojileri ve yöntemleri listelemektedir.

### 1. Responsive Tasarım
- **Mobile-First Approach:** İlk olarak cep telefonu ekranları düşünülerek, daha sonra büyük ekranlara genişleyen (desktop) esnek yapılar hedeflenmiştir.
- **Breakpoints:** Tailwind CSS'in varsayılan responsive kırılımları (sm, md, lg, xl) kullanılmıştır.
- **Flexible Layouts:** `CSS Grid` ve `Flexbox` kullanımıyla cihaz boyutuna göre dinamik adaptasyon.
- **Touch-Friendly:** Mobil cihazlarda dokunmayı kolaylaştıran padding alanlarına sahip butonlar.

### 2. Tasarım Sistemi
- **CSS Framework:** Next.js içerisine gömülü Vanilla CSS (`globals.css`) ile özelleştirilebilir komponentlerin yazılması ve Tailwind CSS v4 altyapısının kullanımı.
- **Renk Paleti:** Doğa ve hayvan konseptine uygun Toprak/Kahverengi (`#8B5A2B`) ile Enerjik Turuncu (`#F47B20`).
- **Tipografi:** Okunabilirliği yüksek `Inter` web font (Google Fonts).
- **Komponent Yapısı:** Glassmorphism arayüz efektleri ve yuvarlatılmış köşeli yeniden kullanılabilir kartlar.

### 3. Performans Optimizasyonu
- **Code Splitting:** Next.js App Router yapısı gereği sayfa bazlı otomatik "code splitting".
- **Lazy Loading:** `next/image` bileşeni ile görsellerin viewport'a girene kadar ertelenmesi (lazy loading).
- **Caching:** Next.js'in statik ve dinamik "Route Cache" stratejileri kullanımı.

### 4. SEO (Search Engine Optimization)
- **Meta Tags:** `layout.tsx` dosyasında Next.js `Metadata` objesi kullanılarak global `<title>` ve `<meta name="description">` tanımları.
- **Semantic HTML:** `<header>`, `<main>`, `<section>`, `<nav>` gibi anlamlı HTML5 etiketleri.

### 5. Erişilebilirlik (Accessibility)
- **Color Contrast:** Arayüzdeki yazı (Kahverengi) ve arkaplan (Krem/Beyaz) renkleri WCAG standartlarına uygun kontrast oranında seçilmiştir.
- **Focus Indicators:** Butonlara (Örn: `btn-primary`) basıldığında animasyonlu ve gölgeli (box-shadow) geri bildirimler.

### 6. Browser Compatibility
- **Modern Browsers:** Chrome, Firefox, Safari, Edge tarayıcılarının stabil sürümlerinde sorunsuz görünüm.
- **CSS Prefixes:** Next.js ve Tailwind CSS tarafından üretim esnasında otomatik olarak (Autoprefixer) eklenir.

### 7. State Management
- **Local State (İstemci):** React Hook'ları (`useState`, `useEffect`) ile form ve UI durum yönetimi (loading, error, token state vs).
- **Data Persistence:** Oturum ve JWT bilgilerinin tarayıcıda geçici kaydı için Client-side `localStorage` kullanımı.

### 8. Routing
- **Client-Side Routing:** Tamamen Next.js `App Router` (`src/app`) altyapısı kullanılarak sayfalar arası (SPA hissiyatı veren) gecikmesiz geçişler.
- **Navigation:** `next/link` modülü (Örn: `/profile`, `/register/owner`) kullanımı.
- **Protected Logic:** Client tarafında Component yüklenirken (useEffect içinde) Token yoksa `router.push('/login')` ile güvenli alanlardan login'e gönderme mekanizması.

### 9. API Entegrasyonu
- **HTTP Client:** Tarayıcının native (doğal) `Fetch API`'si kullanılarak asenkron `async/await` JSON iletişimi.
- **Request Headers:** Güvenlik gerektiren uç noktalarda HTTP İstek Başlığına `Authorization: Bearer <token>` enjekte edilmesi.
- **Error Handling:** Fetch ile dönen HTTP statülerinin (200, 201, 400, 404, 409) incelenmesi. Başarısızlık durumunda sunucu kaynaklı mesajın arayüze çıkarılması.

### 10. Testing
- **Manuel UI Akış Testleri:** Her sayfa için mutlu son (happy-path) ve hatalı giriş testleri.
- **API Kontrol Cüzdanı:** Bütün arka plan entegrasyonlarını simüle eden ve yetkilendirilen `Postman` koleksiyon seti JSON dosyamız.

### 11. Build ve Deployment
- **Build Tool:** Paket yönetimi `npm` platformu kullanılarak `npm run build` komutu ile Next.js compiler (Turbopack) tarafından üretim (production) sürümüne hazırlanması.
- **Hosting / CI-CD:** Kaynak kodların **GitHub** üzerinden **Vercel** platformuna (`paw-carer.vercel.app`) kesintisiz (Continuous Deployment) şekilde aktarılıp yayınlanması.