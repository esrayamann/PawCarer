import amqplib from 'amqplib';

// ─── RabbitMQ Bağlantısı ───
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

let connection: amqplib.ChannelModel | null = null;
let channel: amqplib.Channel | null = null;

// Kuyruk İsimleri
export const QUEUES = {
  USER_REGISTERED: 'user_registered',
  REVIEW_CREATED: 'review_created',
  REVIEW_UPDATED: 'review_updated',   // Toprak Yavuz — Gereksinim 16: Kullanıcı Yorum Güncelleme
  NOTIFICATION: 'notification',
} as const;

/**
 * RabbitMQ bağlantısı ve kanal oluşturur
 */
async function getChannel(): Promise<amqplib.Channel | null> {
  try {
    if (channel) return channel;

    connection = await amqplib.connect(RABBITMQ_URL);
    channel = await (connection as any).createChannel();

    if (!channel) return null;

    // Kuyrukları tanımla (idempotent — zaten varsa hata vermez)
    await channel.assertQueue(QUEUES.USER_REGISTERED, { durable: true });
    await channel.assertQueue(QUEUES.REVIEW_CREATED, { durable: true });
    await channel.assertQueue(QUEUES.REVIEW_UPDATED, { durable: true });
    await channel.assertQueue(QUEUES.NOTIFICATION, { durable: true });

    console.log('[RabbitMQ] ✅ Bağlantı ve kuyruklar hazır');

    (connection as any).on('close', () => {
      console.warn('[RabbitMQ] ⚠️ Bağlantı kapandı');
      channel = null;
      connection = null;
    });

    (connection as any).on('error', (err: any) => {
      console.error('[RabbitMQ] ❌ Bağlantı hatası:', err.message);
      channel = null;
      connection = null;
    });

    return channel;
  } catch (err) {
    console.warn('[RabbitMQ] ⚠️ Bağlantı kurulamadı:', (err as Error).message);
    return null;
  }
}

/**
 * Kuyruğa mesaj gönder (Producer)
 */
export async function publishMessage(queue: string, data: Record<string, unknown>): Promise<boolean> {
  try {
    const ch = await getChannel();
    if (!ch) {
      console.warn(`[RabbitMQ] Mesaj gönderilemedi → ${queue} (bağlantı yok)`);
      return false;
    }

    const message = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
    });

    ch.sendToQueue(queue, Buffer.from(message), {
      persistent: true, // Mesaj disk'e yazılsın, kuyruk crash'lerde kaybolmasın
    });

    console.log(`[RabbitMQ] 📤 Mesaj gönderildi → ${queue}:`, message);
    return true;
  } catch (err) {
    console.error('[RabbitMQ] Mesaj gönderme hatası:', err);
    return false;
  }
}

/**
 * Kuyruktan mesaj dinle (Consumer)
 */
export async function consumeMessages(
  queue: string,
  handler: (data: Record<string, unknown>) => Promise<void>
): Promise<void> {
  try {
    const ch = await getChannel();
    if (!ch) {
      console.warn(`[RabbitMQ] Consumer başlatılamadı → ${queue}`);
      return;
    }

    await ch.consume(queue, async (msg) => {
      if (msg) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`[RabbitMQ] 📥 Mesaj alındı ← ${queue}:`, data);
          await handler(data);
          ch.ack(msg); // Mesaj başarıyla işlendi
        } catch (err) {
          console.error(`[RabbitMQ] Mesaj işleme hatası ← ${queue}:`, err);
          ch.nack(msg, false, false); // Hatalı mesajı tekrar kuyruğa koyma
        }
      }
    });

    console.log(`[RabbitMQ] 👂 Consumer dinliyor → ${queue}`);
  } catch (err) {
    console.error('[RabbitMQ] Consumer başlatma hatası:', err);
  }
}
