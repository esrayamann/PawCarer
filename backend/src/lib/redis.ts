import Redis from 'ioredis';

// ─── Redis Bağlantısı ───
// Docker ortamında REDIS_URL environment variable'ı kullanılır
// Yerel geliştirmede fallback olarak localhost kullanılır
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redis: Redis | null = null;

function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        // Bağlantı kuramazsa 3 deneme sonra vazgeç
        if (times > 3) {
          console.warn('[Redis] Bağlantı kurulamadı, cache devre dışı.');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    redis.on('connect', () => {
      console.log('[Redis] ✅ Bağlantı başarılı');
    });

    redis.on('error', (err) => {
      console.warn('[Redis] ⚠️ Bağlantı hatası:', err.message);
    });
  }
  return redis;
}

// ─── Cache Helper Fonksiyonları ───

/**
 * Cache'den veri oku
 * @returns JSON parse edilmiş veri veya null
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient();
    const data = await client.get(key);
    if (data) {
      console.log(`[Redis] ✅ Cache HIT → ${key}`);
      return JSON.parse(data) as T;
    }
    console.log(`[Redis] ❌ Cache MISS → ${key}`);
    return null;
  } catch (err) {
    console.warn('[Redis] Cache okuma hatası:', err);
    return null;
  }
}

/**
 * Cache'e veri yaz
 * @param ttl Saniye cinsinden yaşam süresi (varsayılan: 60 saniye)
 */
export async function cacheSet(key: string, value: unknown, ttl: number = 60): Promise<void> {
  try {
    const client = getRedisClient();
    await client.set(key, JSON.stringify(value), 'EX', ttl);
    console.log(`[Redis] 💾 Cache SET → ${key} (TTL: ${ttl}s)`);
  } catch (err) {
    console.warn('[Redis] Cache yazma hatası:', err);
  }
}

/**
 * Belirli bir cache anahtarını sil
 */
export async function cacheDel(key: string): Promise<void> {
  try {
    const client = getRedisClient();
    await client.del(key);
    console.log(`[Redis] 🗑️ Cache DEL → ${key}`);
  } catch (err) {
    console.warn('[Redis] Cache silme hatası:', err);
  }
}

/**
 * Belirli bir prefix ile başlayan tüm cache anahtarlarını sil
 * Örn: cacheClearPattern('sitters:*') → tüm bakıcı cache'ini temizler
 */
export async function cacheClearPattern(pattern: string): Promise<void> {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
      console.log(`[Redis] 🧹 Cache CLEAR → ${pattern} (${keys.length} anahtar silindi)`);
    }
  } catch (err) {
    console.warn('[Redis] Cache temizleme hatası:', err);
  }
}
