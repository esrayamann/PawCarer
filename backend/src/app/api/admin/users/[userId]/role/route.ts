import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { userId } = resolvedParams;
    
    // 1. Yetkilendirme (Admin Rolü Gereklidir)
    const adminId = getUserIdFromRequest(req);
    
    if (!adminId) {
      return NextResponse.json({ error: "Lütfen önce giriş yapın." }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetki yetersiz! Bu işlemi yalnızca Yöneticiler yapabilir." }, { status: 403 });
    }

    // 2. Request body üzerinden yeni rolü al
    const body = await req.json();
    const { role } = body;

    // Rol validasyonu
    const validRoles = ["OWNER", "SITTER", "ADMIN"];
    
    // Body'de girilen rolu Uppercase'e cevirip kontrol et ("owner" -> "OWNER")
    const formattedRole = role?.toUpperCase();

    if (!formattedRole || !validRoles.includes(formattedRole)) {
      return NextResponse.json({ error: "Geçersiz bir rol (Sadece OWNER, SITTER, ADMIN olabilir)." }, { status: 400 });
    }

    // 3. Hedef kullanıcının varlığını teyit et
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Rolü güncellenecek kullanıcı bulunamadı." }, { status: 404 });
    }

    // 4. Güncelleme İşlemi (Görev 15)
    // Eğer bir kullanıcı OWNER yapılıyorsa ve bir Sitter Profile'ı varsa, o profil silinmeli veya pasife düşmelidir
    // Bu senaryoda daha güvenli bir adım atarak Sitter'dan Owner'a düşürmede profil de silebilirsiniz
    // Fakat şimdilik sadece Rol güncellemesi yapıyoruz (Veritabanında kalmaya devam edebilir)
    
    await prisma.user.update({
      where: { id: userId },
      data: { role: formattedRole as any }
    });

    // 200 OK
    return NextResponse.json({ message: "Kullanıcı rolü başarıyla güncellendi." }, { status: 200 });

  } catch (error: any) {
    console.error("Rol güncellenirken hata oluştu:", error);
    return NextResponse.json({ error: "İç sunucu hatası" }, { status: 500 });
  }
}
