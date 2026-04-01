# Esra Yaman Web Frontend Görevleri

**Web Frontend Domain Adresi:** `https://paw-carer.vercel.app`
**Front-end Test Videosu:** [Ödev Videosu Linkini Buraya Ekleyiniz](https://youtube.com/...)

---

## 1. Müşteri (Owner) Kayıt Sayfası
- **API Endpoint:** `POST /api/auth/register/owner`
- **Frontend Rotası:** `/register/owner`
- **Görev:** Hayvan sahiplerinin sisteme kayıt olmasını sağlayan arayüz tasarımı.
- **UI Bileşenleri:**
  - Glassmorphism özellikli responsive kayıt formu.
  - Ad, soyad, e-posta, şifre ve lokasyon veri giriş alanları.
  - "Hayvan Sahibi Hesabı Oluştur" onay butonu (Primary).
  - Yönlendirme linki: "Bakıcı olarak mı hizmet vermek istersiniz?"
- **Kullanıcı Deneyimi:**
  - Sayfa yüklendiğinde slide-up mikro-animasyon tetiklenmesi.
  - Boş bırakılamaz zorunlu alanlar için HTML5 validation.
  - Kayıt esnasında butonun "Kaydediliyor..." state'ine sokularak çoklu tıklamanın engellenmesi.
  - Başarılı işlem sonrası anında login sayfasına "Kayıt Başarılı" parametresi ile yönlendirme.
- **Akış Adımları:**
  1. Kullanıcı müşteri kayıt linkine tıklar.
  2. Bilgileri doldurup kayıt butonuna basar.
  3. API 201 dönerse form temizlenir ve `/login` rotasına gönderilir.
- **Teknik Detaylar:**
  - React `useState` kullanılarak form verilerinin JSON objesinde tutulması.
  - `fetch` API ile Server'a JSON body basılması.
  - Vercel App Router yapısı üzerine inşa.

## 2. Bakıcı (Sitter) Kayıt Sayfası
- **API Endpoint:** `POST /api/auth/register/sitter`
- **Frontend Rotası:** `/register/sitter`
- **Görev:** Hizmet verecek bakıcılar için özel detaylı kayıt formu.
- **UI Bileşenleri:**
  - Bakıcı konseptine (yeşil tonlu odaklı) uygun renk paletli arayüz.
  - Kişisel bilgilerin ve "Hizmet Bölgesi" girdi alanlarının oluşturulması.
  - "Bakıcı Profilimi Başlat" butonu (Secondary).
- **Kullanıcı Deneyimi:**
  - Hata oluşursa (409 Conflict vb) kırmızı alert paneli ile detaylı bilgilendirme.
  - Müşteri profilinden ayrıştırmak için görsel farklılıklar.
- **Akış Adımları:**
  1. Kullanıcı bakıcı hesabı açma formuna girer.
  2. Konum vb. ek detayları ile submit eder.
  3. Kayıtlı e-posta hatası almazsa giriş sayfasına iletilir.
- **Teknik Detaylar:**
  - API katmanına `location` ve `fullName` değişkenlerinin JSON formatında iletilmesi.

## 3. Giriş Yap (Login) Arayüzü
- **API Endpoint:** `POST /api/auth/login`
- **Frontend Rotası:** `/login`
- **Görev:** Sisteme kayıtlı her iki rol için de Login işlemlerinin yönetildiği arayüz.
- **UI Bileşenleri:**
  - PawCarer maskot ikonu içeren stilize edilmiş giriş kutusu.
  - E-Posta ve maskeli (type="password") şifre alanı.
  - Yeni kayıttan gelenler için başarılı kayıt yeşil barı.
- **Kullanıcı Deneyimi:**
  - `?registered=true` URL verisi gelmişse kullanıcı tebrik edilir.
  - Yanlış girdi halinde `error` metni panel içerisinde anında belirmesi.
- **Akış Adımları:**
  1. E-Posta ve Şifre bilgileri ile `POST` isteği yapılır.
  2. Başarılı dönüşte alınan `JWT Token` sisteme iz bırakır.
  3. Kişi hiç beklemeden `/profile` ekranına alınır.
- **Teknik Detaylar:**
  - Dönen kimlik bilgilerinin ve `token` verisinin Client Side `localStorage` üzerine geçici kaydı.
  - Next.js Client Component yapısı ile React Hook'larının tam izolasyon kullanımı.

## 4. Kullanıcı / Bakıcı Profil Güncelleme Paneli
- **API Endpoint:** `PUT /api/users/profile` & `PUT /api/sitters/profile`
- **Frontend Rotası:** `/profile`
- **Görev:** Kimlik doğrulaması yapılmış hesapların kişisel verilerini güncellemesi.
- **UI Bileşenleri:**
  - Rol belirten uyarı rozeti (Rozet rengi role göre değişir).
  - Ad ve lokasyon güncellemeleri için input alanları.
  - Eğer rol `SITTER` ise açılan "Saatlik Ücret" ve "Biyografi" alanları.
  - Çıkış Yap butonu (Log out).
- **Kullanıcı Deneyimi:**
  - LocalStorage'daki rol değişkenine göre ekranın anında adapte olması.
  - Sayfa girişinde eski verilerin inputlar içine hazır olarak dolması.
  - Onay sonrası anlık "Başarıyla güncellendi 🎉" tatmin mesajı.
- **Akış Adımları:**
  1. Login yetkisi onayı yapılır (Yoksa login'e gönderilir).
  2. Kullanıcı istediği veri alanını değiştirir.
  3. Önce User API'ye, ardından gerekiyorsa Sitter API'ye `PUT` isteği gider.
- **Teknik Detaylar:**
  - Token eşliğinde `Authorization: Bearer <token>` Header eklentisinin yapılması.
  - Dinamik Render (Conditional Rendering) yapısının `user.role` kontrolü ile tasarlanması.

## 5. Bakıcı Detay ve Yorum Yapma Sayfası
- **API Endpoints:** `GET /api/sitters/{sitterId}/rating` & `POST /api/reviews`
- **Frontend Rotası:** `/sitters/[id]`
- **Görev:** Herkese açık bakıcı detaylarını çekme ve hesapla sisteme giriş yapanların yorum yapabilmesi.
- **UI Bileşenleri:**
  - Avatar, Lokasyon, İsim barındıran dinamik Header Bölümü.
  - Toplam Yıldız ve Toplam Değerlendirme istatistik kümesi.
  - Yorum yazmak için form ve tıklanabilir 5 adet Yıldız ikonları.
- **Kullanıcı Deneyimi:**
  - Hangi yıldıza basarsan öncekinin de turuncuya boyanması (Real-time feedback).
  - Veri bulunamazsa Placeholder "..." metninin gelmesi.
- **Akış Adımları:**
  1. `[id]` paramı kullanılarak `GET` işlemi ile ortalama yıldız puanı çekilir.
  2. Ziyaretçi yıldıza tıklayıp metnini yazar ve "Gönder" der.
  3. O esnada `localStorage` kontrolü yapılır, giriş yapmamışsa hata verir.
  4. İşlem geçtikten sonra Rating yeniden çekilip sayfada taze hali gösterilir.
- **Teknik Detaylar:**
  - Next.js `use` yapısı ile Asenkron parameter okunması.
  - İki farklı API ucunun aynı Component içinde asenkron zincirde kullanımı.

## 6. Admin Kullanıcı Silme Paneli
- **API Endpoint:** `DELETE /api/admin/users/{userId}`
- **Frontend Rotası:** `/admin/users`
- **Görev:** Sistem güvenliği adına ihlal yapan profilleri sonsuza dek silme işlemi.
- **UI Bileşenleri:**
  - Adminlere özel kırmızı border'lı tehlike paneli.
  - Kullanıcı ID'si için text input ucu.
  - Dev kırmızı "Hesabı Yok Et" aksiyonu.
- **Kullanıcı Deneyimi:**
  - Rol ADMIN değilse devasa "Erişim Reddedildi ⛔️" uyarısını görüp işlemin engellenmesi.
  - Yanlış tıklamalara karşı Browser Confirmation (Çift Onay) dialogu çıkması ("Kalıcı olarak silinecek emin misiniz?").
- **Akış Adımları:**
  1. Admin ID girip butona basar.
  2. Tarayıcı Emin Misin modülü döner. Onaylanırsa DELETE isteği yollanır.
- **Teknik Detaylar:**
  - JWT Token güvencesi ile sunucu tabanlı `DELETE` işlemi.
  - Hatalı giriş veya yetkisiz erişimlerde React try-catch bloğu kullanılarak client-side hata yönetimi.
