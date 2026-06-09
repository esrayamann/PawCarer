import { consumeMessages, QUEUES } from './rabbitmq';

/**
 * PawCarer — RabbitMQ Consumer Worker
 * 
 * Bu modül, RabbitMQ kuyruklarından mesajları dinler ve işler.
 * Gerçek projede e-posta gönderimi, push notification vs. yapılabilir.
 * Şimdilik log'lama ile gösteriyoruz.
 */

// ─── Kullanıcı Kayıt Bildirimi ───
async function handleUserRegistered(data: Record<string, unknown>): Promise<void> {
  console.log('═══════════════════════════════════════════════════');
  console.log('🎉 YENİ KULLANICI KAYDI BİLDİRİMİ');
  console.log(`   👤 İsim    : ${data.fullName}`);
  console.log(`   📧 Email   : ${data.email}`);
  console.log(`   🏷️  Rol     : ${data.role}`);
  console.log(`   📍 Konum   : ${data.location || 'Belirtilmemiş'}`);
  console.log(`   🕐 Zaman   : ${data.timestamp}`);
  console.log('═══════════════════════════════════════════════════');
  
  // Gerçek projede:
  // - Hoşgeldin e-postası gönderilebilir
  // - Admin'e bildirim gönderilebilir
  // - Analytics servise kayıt bilgisi iletilebilir
}

// ─── Yeni Yorum Bildirimi ───
async function handleReviewCreated(data: Record<string, unknown>): Promise<void> {
  console.log('═══════════════════════════════════════════════════');
  console.log('⭐ YENİ YORUM BİLDİRİMİ');
  console.log(`   🆔 Yorum ID   : ${data.reviewId}`);
  console.log(`   👤 Bakıcı ID  : ${data.sitterId}`);
  console.log(`   ⭐ Puan       : ${data.rating}/5`);
  console.log(`   💬 Yorum      : ${data.comment || 'Yorum yok'}`);
  console.log(`   🕐 Zaman      : ${data.timestamp}`);
  console.log('═══════════════════════════════════════════════════');
  
  // Gerçek projede:
  // - Bakıcıya bildirim gönderilebilir
  // - Ortalama puan güncelleme servisi tetiklenebilir
  // - Küfür/spam filtresi uygulanabilir
}

// ─── Yorum Güncelleme Bildirimi (Toprak Yavuz — Gereksinim 16) ───
async function handleReviewUpdated(data: Record<string, unknown>): Promise<void> {
  console.log('═══════════════════════════════════════════════════');
  console.log('✏️  YORUM GÜNCELLEME BİLDİRİMİ');
  console.log(`   🆔 Yorum ID      : ${data.reviewId}`);
  console.log(`   👤 Bakıcı ID     : ${data.sitterId}`);
  console.log(`   👁️  Güncelleyen  : ${data.reviewerId}`);
  console.log(`   ⭐ Yeni Puan     : ${data.rating}/5`);
  console.log(`   💬 Yeni Yorum    : ${data.comment || 'Yorum yok'}`);
  console.log(`   🕐 Güncellenme   : ${data.timestamp}`);
  console.log('═══════════════════════════════════════════════════');

  // Gerçek projede:
  // - Bakıcıya "yorumunuz güncellendi" bildirimi gönderilebilir
  // - Bakıcının ortalama puanı yeniden hesaplanabilir
  // - Moderasyon sistemi tetiklenebilir (içerik değişti mi?)
}

/**
 * Tüm consumer'ları başlat
 * Bu fonksiyon backend başlatılırken çağrılır
 */
export async function startConsumers(): Promise<void> {
  console.log('[Consumer] 🚀 RabbitMQ consumer\'lar başlatılıyor...');
  
  await consumeMessages(QUEUES.USER_REGISTERED, handleUserRegistered);
  await consumeMessages(QUEUES.REVIEW_CREATED, handleReviewCreated);
  await consumeMessages(QUEUES.REVIEW_UPDATED, handleReviewUpdated);
  
  console.log('[Consumer] ✅ Tüm consumer\'lar aktif');
}
