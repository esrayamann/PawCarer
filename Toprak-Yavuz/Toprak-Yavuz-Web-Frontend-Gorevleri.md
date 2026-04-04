# Toprak Yavuz'un Web Frontend Görevleri

Bu doküman Toprak Yavuz'un sorumluluğundaki UI (Arayüz) gereksinimlerini listelemektedir. Mimari Tailwind CSS ve React/Next.js kullanılarak tasarlanacaktır.

## 1. Evcil Hayvan Profili Oluşturma Sayfası
- **Web Rotası:** `/pets/new`
- **İlgili API:** `POST /api/pets`
- **Görev:** Kullanıcının hayvanını sisteme eklemesi için interaktif bir kayıt arayüzü tasarımı.
- **UI Bileşenleri:**
  - Responsive geniş form kartı (Form container).
  - İsim girdisi (`name`).
  - Hayvan tipi açılır menüsü (Kedi, Köpek, Kuş vb).
  - Cins girdisi (Dinamik text veya dropdown).
  - Yaş (Number input).
  - Özel notlar alanı (Textarea).
  - "Profili Oluştur" (Primary Submit Button).
- **Kullanıcı Deneyimi:**
  - Hatalı form teslimleri için Inline-validation (eksik zorunlu alan uyarıları).
  - Form verisi kaydedilirken dönen Loading icon ve işlemi engelleme durumu (disabled button).
  - İşlem başarılı olunca sayfa başında beliren başarı göstergesi (Toast / Alert).

## 2. Gelişmiş Bakıcı Arama ve Filtreleme Sayfası
- **Web Rotası:** `/search`
- **İlgili API:** `GET /api/sitters` (Query Parametreleri ile)
- **Görev:** Hayvan sahiplerinin istedikleri özelliklere uygun bakıcıları listeleyebileceği vitrin sayfası.
- **UI Bileşenleri:**
  - Sayfa başında Konum (Location) metin araması barı.
  - Yan menüde (veya üst kısımda dropdown olarak) Tür ve Cins filtreleri (Kedi, Köpek, Golden vb.).
  - Filtrele butonu.
  - "Bakıcılar" Grid (Izgara) Layout (Mobile: List, Desktop: Grid).
  - Her bir satır/kutu içerisinde "Sitter Card" bileşenleri (Ad, Soyad, Bio, Ücret, Kabul Ettiği Türler).
  - Bakıcı yıldızı (`averageRating`) ve toplam oy göstergesi componentleri.
- **Kullanıcı Deneyimi:**
  - Filtresiz ilk girişte tüm sonuçların ekrana basılması (Eğer data yoksa "Bakıcı Bulunamadı" sayfası/görseli).
  - Arama butonuna basınca skeleton-loading ekranı ve yumuşak geçiş efektleri (Modern hover tasarımları).

## 3. Admin Kontrol Paneli (Dashboard)
- **Web Rotası:** `/admin`
- **İlgili API'ler:** `DELETE /api/admin/reviews`, `DELETE /api/admin/sitters`, `PUT /api/admin/users/role`
- **Görev:** Yetkili (Admin) hesaplara özel kuralları ihlal eden kişileri ve içerikleri düzenleme merkezi.
- **UI Bileşenleri:**
  - Sade, okunaklı Tailwind data tabloları (Kullanıcılar Tablosu, Bakıcılar Tablosu, Yorumlar Tablosu).
  - Seçili kullanıcının Rolünü değiştirebilmeyi sağlayan küçük 'Dropdown' (Select) yapısı.
  - Yorum/Bakıcı silmek için kırmızı (Danger) "Çöp Kutusu" ikonu butonu.
  - Güvenlik uyarı Modalı (Are you sure you want to delete?).
- **Kullanıcı Deneyimi:**
  - Yalnızca "ADMIN" olarak yetki almış hesapların bu paneli görebilmesi, yetkisiz ise giriş sayfasına "Access Denied" ile atılması.
  - Veri silinirken veya güncellenirken optimistic update uygulanarak ekrandan anında kaldırılması veya başarı bildirimi.

## 4. Kullanıcı Yorum Güncelleme Modalı/Formu
- **Web Rotası:** Kullanıcının asıl profil detayında (veya ayrı bir route'da) açılacak diyalog.
- **İlgili API:** `PUT /api/reviews/{reviewId}`
- **Görev:** Kullanıcının geçmişteki deneyim puanını değiştirebilme hakkı.
- **UI Bileşenleri:**
  - CSS/Tailwind ile hazırlanmış basit bir Modal penceresi.
  - Tıklanabilir 5'li Yıldız Sistemi componenti (Rating Widget).
  - Yorum açıklama alanı (Textarea).
  - "Değişiklikleri Kaydet" ve "Vazgeç" (Cancel) Butonları.
