import { NextRequest } from "next/server";

/**
 * Kimlik doğrulama işlemleri için geçici yardımcı fonksiyon.
 * Esra Yaman (JWT / Auth) geliştirmelerini tamamlayana kadar,
 * Authorization başlığındaki Bearer token'ı doğrudan userId olarak kabul ediyoruz.
 * 
 * Kullanım Örneği: headers: { Authorization: "Bearer <gercek-uuid-buraya>" }
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  // "Bearer " kısmını atıp geriye kalan stringi userId olarak dönüyoruz
  const token = authHeader.split(" ")[1];
  return token || null;
}
