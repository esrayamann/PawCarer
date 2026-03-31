import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { reviewId } = resolvedParams;
    
    // 1. Yetkilendirme (Auth) ve Rol (Role) Kontrolü
    const adminId = getUserIdFromRequest(req);
    
    if (!adminId) {
      return NextResponse.json({ error: "Lütfen giriş yapın." }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });

    // Görev 13: Yöneticinin sistemi ihlal eden yorumu silmesi -> Sadece ADMIN yapabilir
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetki yetersiz (Sadece admin kullanabilir)" }, { status: 403 });
    }

    // 2. Silinmek istenen yorumun var olup olmadığını teyit et
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return NextResponse.json({ error: "Silinecek yorum bulunamadı." }, { status: 404 });
    }

    // 3. Yorumu veritabanından kalıcı olarak sil
    await prisma.review.delete({
      where: { id: reviewId }
    });

    // Başarı durumu (204 No Content API Tasarımı belirtildiği gibi)
    return new NextResponse(null, { status: 204 });

  } catch (error: any) {
    console.error("Yorum silinirken hata oluştu:", error);
    return NextResponse.json({ error: "İç sunucu hatası" }, { status: 500 });
  }
}
