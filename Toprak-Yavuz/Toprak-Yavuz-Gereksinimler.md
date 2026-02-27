1. **Evcil Hayvan Profili Oluşturma**
   - **API Metodu:** `POST /pets`
   - **Açıklama:** Kullanıcıların sahip oldukları evcil hayvanlar için sistemde profil oluşturmasını sağlar. Hayvanın adı, türü, cinsi ve diğer özelliklerinin kaydedilmesini içerir.

2. **Konuma Göre Arama Yapılması**
   - **API Metodu:** `GET /search/location`
   - **Açıklama:** Kullanıcıların belirli bir coğrafi bölgedeki veya yakınındaki bakıcıları bulmasını sağlar. Konum verilerine göre filtreleme yaparak en uygun sonuçları listeler.

3. **Hayvan Türüne Göre Filtreleme**
   - **API Metodu:** `GET /search/type`
   - **Açıklama:** Arama sonuçlarının kedi, köpek, kuş gibi hayvan türlerine göre daraltılmasını sağlar. Kullanıcılar sadece kendi evcil hayvan türüne hizmet veren bakıcıları görüntüleyebilir.

4. **Hayvan Cinsine Göre Filtreleme**
   - **API Metodu:** `GET /search/breed`
   - **Açıklama:** Hayvan türü altındaki spesifik cinslere göre detaylı arama yapılmasını sağlar. Bakıcının belirli cinsler üzerindeki uzmanlığına göre seçim yapılabilir.

5. **Admin Yorum Silme**
   - **API Metodu:** `DELETE /admin/reviews/{reviewId}`
   - **Açıklama:** Yönetici panelinden uygunsuz, hatalı veya kural ihlali içeren kullanıcı yorumlarının sistemden kalıcı olarak kaldırılmasını sağlar. Bu işlem sadece yetkili yöneticiler tarafından gerçekleştirilebilir.

6. **Admin Bakıcı Silme**
   - **API Metodu:** `DELETE /admin/sitters/{sitterId}`
   - **Açıklama:** Hizmet standartlarına uymayan veya platform kurallarını ihlal eden bakıcı hesaplarının yönetici tarafından sistemden silinmesini sağlar. Bu işlem geri alınamaz ve bakıcının tüm verilerini kapsar.

7. **Admin Yetkilendirme**
   - **API Metodu:** `PUT /admin/users/{userId}/role`
   - **Açıklama:** Mevcut kullanıcıların yetki seviyelerinin (Kullanıcı, Bakıcı, Admin) güncellenmesini sağlar. Kullanıcılara sistem üzerinde yeni roller atanması veya mevcut rollerinin değiştirilmesi işlemlerini içerir.

8. **Kullanıcı Yorum Güncelleme**
   - **API Metodu:** `PUT /reviews/{reviewId}`
   - **Açıklama:** Kullanıcının daha önce yaptığı bir yorumu veya verdiği puanı düzenlemesine olanak tanır. Güvenlik için kullanıcılar sadece kendi yaptıkları yorumları güncelleyebilirler.