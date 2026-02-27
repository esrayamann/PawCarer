1. **Hayvan Sahibi Kaydı**
   - **API Metodu:** `POST /auth/register/owner`
   - **Açıklama:** Sisteme "Hayvan Sahibi" rolüyle yeni kullanıcıların kayıt olmasını sağlar. Bu kullanıcılar evcil hayvan profili oluşturabilir ve bakıcı arayabilirler.

2. **Bakıcı Kaydı**
    - **API Metodu:** `POST /auth/register/sitter`
    - **Açıklama:** Sisteme "Bakıcı" rolüyle yeni kullanıcıların kayıt olmasını sağlar. Bakıcıların hizmet verebilmesi için gerekli olan profil ve uzmanlık bilgilerinin toplanmasını içerir.

3. **Giriş Yap**
    - **API Metodu:** `POST /auth/login`
    - **Açıklama:** Kayıtlı kullanıcıların email ve şifreleri ile sisteme güvenli bir şekilde erişim sağlamasına olanak tanır. Başarılı girişte bir oturum anahtarı (Token) oluşturulur.

4. **Bakıcıya Yorum Yapma**
    - **API Metodu:** `POST /reviews`
    - **Açıklama:** Hizmet alan kullanıcıların, aldıkları hizmet sonrası bakıcı hakkında deneyimlerini ve geri bildirimlerini paylaşmasını sağlar.

5. **Yorumlarda Yıldız Ortalaması Alınması**
    - **API Metodu:** `GET /sitters/{sitterId}/rating`
    - **Açıklama:** Bir bakıcıya yapılan tüm yorumlardaki puanların aritmetik ortalamasını hesaplar. Bu veri, bakıcı profilinde genel güvenilirlik puanı olarak gösterilir.

6. **Admin Kullanıcı Silme**
    - **API Metodu:** `DELETE /admin/users/{userId}`
    - **Açıklama:** Yönetici yetkisine sahip kullanıcıların, platform kurallarına uymayan standart kullanıcı hesaplarını sistemden kalıcı olarak kaldırmasını sağlar.

7. **Bakıcı Hesap Bilgileri Güncelleme**
    - **API Metodu:** `PUT /sitters/profile`
    - **Açıklama:** Bakıcıların sundukları hizmet detaylarını, fiyatlandırmalarını veya müsaitlik durumlarını içeren profesyonel profillerini güncellemelerine imkan tanır.

8. **Kullanıcı Hesap Bilgileri Güncelleme**
    - **API Metodu:** `PUT /users/profile`
    - **Açıklama:** Standart kullanıcıların (hayvan sahiplerinin) ad, soyad ve iletişim bilgileri gibi kişisel profil detaylarını değiştirmesini ve güncel tutmasını sağlar.