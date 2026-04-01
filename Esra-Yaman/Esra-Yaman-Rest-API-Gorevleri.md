# Esra Yaman REST API Görevleri

**REST API Domain Adresi:** `https://paw-carer.vercel.app/api`
**API Test Videosu:** [Ödev Videosu Linkini Buraya Ekleyiniz](https://youtube.com/...)

---

## 1. Hayvan Sahibi (Owner) Kaydı
- **Endpoint:** `POST /api/auth/register/owner`
- **Görev:** Sisteme hayvan sahibi olarak kayıt olma.
- **Request Body:** 
  ```json
  {
    "fullName": "Esra Yaman",
    "email": "owner@example.com",
    "password": "Mypassword123",
    "location": "Kadıköy, İstanbul"
  }
  ```
- **Response:** `201 Created`

## 2. Bakıcı (Sitter) Kaydı
- **Endpoint:** `POST /api/auth/register/sitter`
- **Görev:** Sisteme bakıcı olarak kayıt olma ve profil oluşturma.
- **Request Body:** 
  ```json
  {
    "fullName": "Esra Sitter",
    "email": "sitter@example.com",
    "password": "Mypassword123",
    "location": "Ataşehir, İstanbul"
  }
  ```
- **Response:** `201 Created`

## 3. Giriş Yap (Login)
- **Endpoint:** `POST /api/auth/login`
- **Görev:** Kullanıcıların (Sitter veya Owner) JWT Token alıp giriş yapması.
- **Request Body:** 
  ```json
  {
    "email": "owner@example.com",
    "password": "Mypassword123"
  }
  ```
- **Response:** `200 OK` (token ve user objesi döner)

## 4. Bakıcıya Yorum Yapma
- **Endpoint:** `POST /api/reviews`
- **Görev:** Hizmet alan kullanıcının bakıcıyı puanlayıp yorum yapması.
- **Authentication:** Bearer Token Gerekli
- **Request Body:** 
  ```json
  {
    "sitterId": "sitter_uuid_buraya",
    "rating": 5,
    "comment": "Tavsiye ederim, çok iyi ilgilendi."
  }
  ```
- **Response:** `201 Created`

## 5. Bakıcı Puan Görüntüleme
- **Endpoint:** `GET /api/sitters/{sitterId}/rating`
- **Görev:** Belirli bir bakıcının ortalama puanını ve yorum sayısını listeler.
- **Authentication:** Gerekmez (Public)
- **Response:** `200 OK`

## 6. Admin Kullanıcı Silme
- **Endpoint:** `DELETE /api/admin/users/{userId}`
- **Görev:** Yalnızca ADMIN yetkisine sahip kullanıcıların başka bir hesabı kalıcı silmesi.
- **Authentication:** Bearer Token Gerekli (Sadece ADMIN)
- **Response:** `200 OK`

## 7. Bakıcı Profilini Güncelleme
- **Endpoint:** `PUT /api/sitters/profile`
- **Görev:** Bakıcının bio, saatlik ücret gibi özel alanlarını güncellemesi.
- **Authentication:** Bearer Token Gerekli (Sadece SITTER)
- **Request Body:** 
  ```json
  {
    "bio": "Yeni biyografi metnim",
    "hourlyRate": 250
  }
  ```
- **Response:** `200 OK`

## 8. Kullanıcı Temel Profilini Güncelleme
- **Endpoint:** `PUT /api/users/profile`
- **Görev:** Giriş yapmış kişinin temel bilgilerini (ad, lokasyon) gizlice güncellemesi.
- **Authentication:** Bearer Token Gerekli
- **Request Body:** 
  ```json
  {
    "fullName": "Yeni Adım",
    "location": "Yeni Lokasyonum"
  }
  ```
- **Response:** `200 OK`
