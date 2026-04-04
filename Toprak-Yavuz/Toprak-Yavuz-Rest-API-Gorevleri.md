# Toprak Yavuz'un REST API Metotları

**API Test Postman:** `PawCarer_Toprak_Yavuz_Postman.json`

**API Test Videosu:** [Toprak Yavuz Gereksinimler API Test Videosu](https://youtu.be/eDMo8-ExUlM)  

## 1. Evcil Hayvan Profili Oluşturma
- **Endpoint:** `POST /api/pets`
- **Görev:** Kullanıcının (Owner) kendine ait bir evcil hayvan profili yaratması.
- **Request Body:** 
  ```json
  {
    "name": "Leo",
    "petType": "Kedi",
    "breed": "British Shorthair",
    "age": 2,
    "notes": "Yalnız kalmaktan hoşlanmaz."
  }
  ```
- **Response:** `201 Created` - Hayvan profili başarıyla oluşturuldu.

## 2. Bakıcı Arama ve Filtreleme (Çoklu Filtre)
- **Endpoint:** `GET /api/sitters`
- **Görev:** Bakıcıları istenilen konuma, hayvan türüne ve hayvan cinsine göre filtreleyip listeleme (Gereksinim 10, 11, 12 içerir). Yorumların ortalamasını ve toplam değerlendirme sayısını otomatik döner.
- **Query Parameters:** 
  - `location` (string, opsiyonel) - Örn: "İstanbul"
  - `petType` (string, opsiyonel) - Örn: "Kedi"
  - `petBreed` (string, opsiyonel) - Örn: "Siyam"
- **Response:** `200 OK` - Filtrelenmiş bakıcılar ve onlara ait `averageRating` listesi getirilir.

## 3. Admin Yorum Silme
- **Endpoint:** `DELETE /api/admin/reviews/{reviewId}`
- **Path Parameter:** `reviewId`
- **Görev:** Yönetici (ADMIN) yetkisine sahip bir kullanıcının, kurallara uymayan bir değerlendirme yorumunu sistemden kalıcı silmesi.
- **Authentication:** Bearer Token (ADMIN yetkisi şarttır).
- **Response:** `204 No Content` - Yorum başarıyla silindi. (Yetkisizse `403 Forbidden`).

## 4. Admin Bakıcı Silme
- **Endpoint:** `DELETE /api/admin/sitters/{sitterId}`
- **Path Parameter:** `sitterId`
- **Görev:** Yönetici (ADMIN) yetkisine sahip kullanıcının iptal edilecek bir bakıcı profilini kalıcı olarak silmesi ve ilgili kullanıcıyı normal OWNER rolüne düşürmesi.
- **Authentication:** Bearer Token (ADMIN yetkisi şarttır).
- **Response:** `204 No Content` - Bakıcı profili başarıyla silindi.

## 5. Admin Yetkilendirme (Rol Güncelleme)
- **Endpoint:** `PUT /api/admin/users/{userId}/role`
- **Path Parameter:** `userId`
- **Görev:** Yönetici (ADMIN) yetkisine sahip kullanıcının sistemdeki sıradan kullanıcılara "SITTER" veya "ADMIN" rolleri atayabilmesi ya da rollerini geri alabilmesi.
- **Request Body:** 
  ```json
  {
    "role": "SITTER"
  }
  ```
- **Authentication:** Bearer Token (ADMIN yetkisi şarttır).
- **Response:** `200 OK` - Kullanıcı rolü başarıyla değiştirildi.

## 6. Kullanıcı Yorum Güncelleme
- **Endpoint:** `PUT /api/reviews/{reviewId}`
- **Path Parameter:** `reviewId`
- **Görev:** Bir kullanıcının daha önce bir bakıcıya (sitter) vermiş olduğu yıldız puanı veya açıklama kısmını düzenlemesi.
- **Request Body:** 
  ```json
  {
    "rating": 4,
    "comment": "Gerçekten gayet ilgilendiler, memnun kaldım. Puanımı güncelledim."
  }
  ```
- **Authentication:** Bearer Token (Yalnızca yorumun asıl sahibi işlemi yapabilir).
- **Response:** `200 OK` - Yorum başarıyla güncellendi. (Sahibi değilse `403 Forbidden`).
