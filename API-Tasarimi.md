# PawCarer API Tasarımı
**OpenAPI Spesifikasyon Dosyası:** [lamine.yaml](lamine.yaml)
Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış, PawCarer mobil ve web uygulamasının gereksinimlerine göre (Gereksinim-Analizi.md) tasarlanan RESTful API uç noktalarını içermektedir.

## OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: PawCarer API
  description: |
    PawCarer uygulaması için RESTful API tasarımı.
    Hem web hem de mobil platformlar için kullanılabilir.
    
    ## Özellikler
    1. Hayvan sahibi veya Bakıcı olarak kayıt olma (Req 1, 2)
    2. Giriş yapma (Req 3)
    3. Kullanıcı ve bakıcı hesap bilgilerini güncelleme (Req 7, 8)
    4. Evcil hayvan profili oluşturma (Req 9)
    5. Konum, tür ve cinse göre bakıcı arama ve filtreleme (Req 10, 11, 12)
    6. Bakıcılara yorum yapma, yorumlarda ortalama yıldız hesabı listeleme (Req 4, 6)
    7. Kendi yaptığı yorumu güncelleme (Req 16)
    8. Yönetici işlemleri (Kullanıcı, bakıcı, yorum silme ve rol atama) (Req 5, 13, 14, 15)
  version: 1.0.0
  contact:
    name: PawCarer Destek Ekibi
    email: support@pawcarer.com

servers:
  - url: https://api.pawcarer.com/v1
    description: Production server
  - url: http://localhost:3000/v1
    description: Development server

tags:
  - name: auth
    description: Kimlik doğrulama ve kayıt işlemleri
  - name: users
    description: Kullanıcı profili işlemleri
  - name: sitters
    description: Bakıcı arama ve profili işlemleri
  - name: pets
    description: Evcil hayvan işlemleri
  - name: reviews
    description: Yorum işlemleri
  - name: admin
    description: Yönetici işlemleri

paths:
  /auth/register:
    post:
      tags:
        - auth
      summary: Kullanıcı veya bakıcı kaydı
      description: Hayvan sahibi veya bakıcı olarak sisteme kayıt olma işlemi. (Req 1, 2)
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserRegistration'
      responses:
        '201':
          description: Kayıt başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '400':
          description: Geçersiz veri (Geçersiz formatta veri veya sistemde zaten var)

  /auth/login:
    post:
      tags:
        - auth
      summary: Kullanıcı girişi
      description: Email ve şifre ile sisteme giriş yapar. JWT token döner. (Req 3)
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginCredentials'
      responses:
        '200':
          description: Giriş başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          description: Yetkisiz giriş (yanlış email veya şifre)

  /users/{userId}:
    put:
      tags:
        - users
      summary: Kullanıcı hesap bilgilerini güncelleme
      description: Kullanıcının kendi hesap bilgilerini güncellemesi. (Req 8)
      operationId: updateUser
      security:
        - bearerAuth: []
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserUpdate'
      responses:
        '200':
          description: Kullanıcı bilgileri başarıyla güncellendi
        '403':
          description: Bu kullanıcıyı güncelleme yetkisi yok
          
  /sitters/{sitterId}:
    put:
      tags:
        - sitters
      summary: Bakıcı hesap bilgilerini güncelleme
      description: Bakıcının kendi hizmet detaylarını ve profilini güncellemesi. (Req 7)
      operationId: updateSitter
      security:
        - bearerAuth: []
      parameters:
        - name: sitterId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SitterUpdate'
      responses:
        '200':
          description: Bakıcı bilgileri güncellendi
        '403':
          description: Bu profili güncelleme yetkisi yok

  /sitters:
    get:
      tags:
        - sitters
      summary: Bakıcıları listeleme ve arama
      description: |
        Konuma göre arama (Req 10), hayvan türüne (Req 11) ve cinsine (Req 12) göre filtreleme yapar. 
        Her bakıcı için yorumların ortalama yıldızı (Req 6) hesaplanarak döndürülür.
      operationId: searchSitters
      parameters:
        - name: location
          in: query
          description: Arama yapılacak konum/şehir
          schema:
            type: string
        - name: petType
          in: query
          description: Filtrelenecek hayvan türü (ör: Kedi, Köpek)
          schema:
            type: string
        - name: petBreed
          in: query
          description: Filtrelenecek hayvan cinsi (ör: Golden, Siyam)
          schema:
            type: string
      responses:
        '200':
          description: Bakıcıların listesi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/SitterResponse'

  /pets:
    post:
      tags:
        - pets
      summary: Evcil hayvan profili oluşturma
      description: Hayvan sahibinin evcil hayvanı için profil oluşturması. (Req 9)
      operationId: createPet
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PetCreate'
      responses:
        '201':
          description: Evcil hayvan profili oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PetResponse'

  /sitters/{sitterId}/reviews:
    post:
      tags:
        - reviews
      summary: Bakıcıya yorum yapma
      description: Kullanıcının hizmet aldığı bakıcıya puan ve yorum bırakması. (Req 4)
      operationId: createReview
      security:
        - bearerAuth: []
      parameters:
        - name: sitterId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReviewCreate'
      responses:
        '201':
          description: Yorum başarıyla kaydedildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReviewResponse'

  /reviews/{reviewId}:
    put:
      tags:
        - reviews
      summary: Kullanıcının yaptığı yorumu güncellemesi
      description: Kullanıcının daha önce yaptığı yorumu veya verdiği puanı düzenlemesi. (Req 16)
      operationId: updateReview
      security:
        - bearerAuth: []
      parameters:
        - name: reviewId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReviewCreate'
      responses:
        '200':
          description: Yorum başarıyla güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReviewResponse'
        '403':
          description: Bu yorumu düzenleme yetkiniz yok

  /admin/users/{userId}:
    delete:
      tags:
        - admin
      summary: Adminin kullanıcı silmesi
      description: Yönetici yetkisine sahip birinin, bir kullanıcı hesabını sistemden kalıcı olarak silmesi. (Req 5)
      operationId: adminDeleteUser
      security:
        - bearerAuth: []
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Kullanıcı silme işlemi başarılı
        '403':
          description: Yetki yetersiz (Admin değil)

  /admin/sitters/{sitterId}:
    delete:
      tags:
        - admin
      summary: Admin bakıcı silmesi
      description: Yönetici yetkisine sahip birinin, bir bakıcı profilini sistemden kalıcı olarak silmesi. (Req 14)
      operationId: adminDeleteSitter
      security:
        - bearerAuth: []
      parameters:
        - name: sitterId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Bakıcı silme işlemi başarılı
        '403':
          description: Yetki yetersiz (Admin değil)

  /admin/reviews/{reviewId}:
    delete:
      tags:
        - admin
      summary: Admin sayfasında yorum silme
      description: Yöneticinin sistemi ihlal eden uygunsuz bir yorumu silmesi. (Req 13)
      operationId: adminDeleteReview
      security:
        - bearerAuth: []
      parameters:
        - name: reviewId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Yorum silme işlemi başarılı
        '403':
          description: Yetki yetersiz (Admin değil)

  /admin/users/{userId}/role:
    put:
      tags:
        - admin
      summary: Adminin rol güncelleme (yetkilendirme) yapması
      description: Yöneticinin bir kullanıcının yetki düzeyini değiştirmesi (örneğin owner -> admin yapmak). (Req 15)
      operationId: adminUpdateRole
      security:
        - bearerAuth: []
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - role
              properties:
                role:
                  type: string
                  enum: [owner, sitter, admin]
                  description: Kullanıcıya atanacak yeni rol
      responses:
        '200':
          description: Kullanıcı rolü başarıyla güncellendi
        '403':
          description: Yetki yetersiz (Admin değil)

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Yetkili işlemler için JWT token gereklidir.

  schemas:
    UserRegistration:
      type: object
      required:
        - email
        - password
        - fullName
        - role
      properties:
        email:
          type: string
          format: email
          example: esra@example.com
        password:
          type: string
          format: password
          minLength: 6
          example: GizliSifre123
        fullName:
          type: string
          example: Esra Yaman
        role:
          type: string
          enum: [owner, sitter]
          description: Hayvan sahibi veya bakıcı seçimi (Req 1, 2)
          example: owner
        location:
          type: string
          description: Bulunduğu şehir/ilçe
          example: Kadıköy, İstanbul

    LoginCredentials:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          format: password

    AuthResponse:
      type: object
      properties:
        token:
          type: string
          description: JWT Access Token
        user:
          $ref: '#/components/schemas/UserResponse'

    UserResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
        fullName:
          type: string
        role:
          type: string
          enum: [owner, sitter, admin]
        location:
          type: string

    UserUpdate:
      type: object
      properties:
        fullName:
          type: string
        location:
          type: string
        phoneNumber:
          type: string
        avatarUrl:
          type: string

    SitterUpdate:
      type: object
      properties:
        hourlyRate:
          type: number
          example: 250.0
          description: Saatlik ücret (TL)
        acceptedPetTypes:
          type: array
          items:
            type: string
          description: Bakılabilen hayvan türleri
          example: ["Kedi", "Köpek"]
        acceptedPetBreeds:
          type: array
          items:
            type: string
          description: Belirli bir türe ait cinsler
          example: ["Siyam", "Golden Retriever"]
        bio:
          type: string
          description: Bakıcı profil açıklaması

    SitterResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        userId:
          type: string
          format: uuid
        fullName:
          type: string
        location:
          type: string
        hourlyRate:
          type: number
        acceptedPetTypes:
          type: array
          items:
            type: string
        acceptedPetBreeds:
          type: array
          items:
            type: string
        bio:
          type: string
        averageRating:
          type: number
          format: float
          description: Bakıcının aldığı yorumların yıldız ortalaması (Req 6)
          example: 4.8
        totalReviews:
          type: integer
          description: Bakıcıya yapılmış toplam yorum sayısı

    PetCreate:
      type: object
      required:
        - name
        - petType
        - breed
      properties:
        name:
          type: string
          example: "Leo"
        petType:
          type: string
          description: Hayvan türü (Kedi, Köpek vs.) (Req 11)
          example: "Kedi"
        breed:
          type: string
          description: Hayvan cins türü (Req 12)
          example: "Siyam"
        age:
          type: integer
          example: 2
        notes:
          type: string
          description: Bakım için özel notlar ve alerjiler
          example: "Akşamüstü yalnız kalmaktan hoşlanmaz."

    PetResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        ownerId:
          type: string
          format: uuid
        name:
          type: string
        petType:
          type: string
        breed:
          type: string
        age:
          type: integer
        notes:
          type: string

    ReviewCreate:
      type: object
      required:
        - rating
        - comment
      properties:
        rating:
          type: integer
          minimum: 1
          maximum: 5
          description: 1-5 arası yıldız (Req 6)
        comment:
          type: string
          description: Açıklama şeklinde inceleme
          
    ReviewResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        sitterId:
          type: string
          format: uuid
        reviewerId:
          type: string
          format: uuid
        rating:
          type: integer
        comment:
          type: string
        createdAt:
          type: string
          format: date-time
```