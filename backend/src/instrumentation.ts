/**
 * Next.js Instrumentation — Sunucu başlatıldığında çalışır
 * RabbitMQ consumer'larını otomatik olarak başlatır
 */
export async function register() {
  // Sadece sunucu tarafında (Node.js runtime) çalıştır
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startConsumers } = await import('@/lib/consumer');
    
    try {
      await startConsumers();
      console.log('[Instrumentation] ✅ RabbitMQ consumer\'lar başlatıldı');
    } catch (err) {
      // RabbitMQ yoksa uygulama çalışmaya devam etsin
      console.warn('[Instrumentation] ⚠️ RabbitMQ consumer başlatılamadı:', err);
    }
  }
}
