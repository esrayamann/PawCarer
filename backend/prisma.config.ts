import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    // Prisma CLI (db push, migrate) işlemleri için her zaman DIRECT_URL kullanılmalıdır
    // Çoğu Connection Pooler (Supabase 6543 portu) DDL komutlarında kilitlenir
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
