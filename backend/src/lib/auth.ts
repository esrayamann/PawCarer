import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

/**
 * Kullanıcı yetkilendirmesi için Bearer Token (JWT) içinden User ID doğrulama.
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, role: string };
    return decoded.userId;
  } catch (error) {
    // Geçersiz veya süresi dolmuş token
    return null;
  }
}

/**
 * Giriş sonrası token yaratan yardımcı fonksiyon
 */
export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

export function getUserRoleFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, role: string };
    return decoded.role;
  } catch (error) {
    return null;
  }
}
