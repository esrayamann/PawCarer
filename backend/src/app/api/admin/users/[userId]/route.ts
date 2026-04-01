import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

interface Params {
  userId: string;
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const p = await params;
    const { userId } = p;
    
    // Authorization token dogrulamasi
    const authenticatedId = getUserIdFromRequest(req);
    
    if (!authenticatedId) {
      return NextResponse.json({ message: 'Yetkisiz erişim.' }, { status: 401 });
    }

    // Yetkili kisinin (isteği atanın) admin olup olmadigini kontrol ediyoruz
    const authenticatedUser = await prisma.user.findUnique({
      where: { id: authenticatedId },
      select: { role: true }
    });

    if (!authenticatedUser || authenticatedUser.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Bu islem icin yeterli yetkiniz (ADMIN rolu) bulunmamaktadir.' },
        { status: 403 }
      );
    }

    // Silinecek kullanici adminin kendisi mi? (Opsiyonel güvenlik, kendini silemez)
    if (userId === authenticatedId) {
      return NextResponse.json(
        { message: 'Kendi hesabinizi yonetici olarak silemezsiniz.' },
        { status: 400 }
      );
    }

    // Kullanici var mi kontrol et
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json({ message: 'Silinecek kullanici sistemde bulunamadi.' }, { status: 404 });
    }

    // Prisma'da onDelete: Cascade eklendigi icin kullanici silinince ona ait reviews ve sitterProfile de silinmeli, 
    // eger hata verirse cascade ayarını gozden gecirmeliyiz (schema'da cascade acık gorunuyor)
    await prisma.user.delete({
      where: { id: userId }
    });

    // Istek basarili sekilde gerceklesti ve islem sona erdi (204 No Content genellikle bos doneriz)
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Admin Delete User Error:', error);
    
    return NextResponse.json(
      { message: 'Kullanici silinirken sistemsel bir hata meydana geldi.' },
      { status: 500 }
    );
  }
}
