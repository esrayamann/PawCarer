import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sitterId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { sitterId } = resolvedParams;
    
    // 1. Yetkilendirme ve Rol Kontrolü (Admin yetkisine sahip olmalı)
    const adminId = getUserIdFromRequest(req);
    
    if (!adminId) {
      return NextResponse.json({ error: "Lütfen giriş yapın." }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetki yetersiz (Yalnızca Admin bakıcı silebilir)" }, { status: 403 });
    }

    // 2. Bakıcının sistemde var olup olmadığını kontrol et
    const sitter = await prisma.sitterProfile.findUnique({
      where: { id: sitterId },
    });

    if (!sitter) {
      return NextResponse.json({ error: "Sistemde böyle bir bakıcı profili bulunamadı." }, { status: 404 });
    }

    // 3. İşlem: Bakıcı Profilini tamamen sil
    await prisma.$transaction([
      prisma.sitterProfile.delete({
        where: { id: sitterId }
      }),
      // Ek olarak, bu kullanıcının rolünü varsayılan OWNER'a geri düşürüyoruz ki artık Sitter görünmesin
      prisma.user.update({
        where: { id: sitter.userId },
        data: { role: 'OWNER' }
      })
    ]);

    // 204 No Content Başarı Yanıtı (API Spec'e uygun)
    return new NextResponse(null, { status: 204 });

  } catch (error: any) {
    console.error("Bakıcı silinirken hata oluştu:", error);
    return NextResponse.json({ error: "İç sunucu hatası" }, { status: 500 });
  }
}
