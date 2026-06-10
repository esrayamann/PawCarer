import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    // Prisma CLI (db push, migrate, studio) için her zaman DIRECT_URL kullanılmalıdır.
    // Supabase'in 6543 portu (transaction pooler) DDL/introspect komutlarında kilitlenir.
    // 5432 portu (DIRECT_URL) doğrudan bağlantı sağlar.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
