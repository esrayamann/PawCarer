import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    // Authorization token dogrulamasi
    const authenticatedId = getUserIdFromRequest(req);
    
    // Kullanici giris yapmamissa
    if (!authenticatedId) {
      return NextResponse.json({ message: 'Yetkisiz islem. Lutfen giris yapiniz.' }, { status: 401 });
    }

    const unparsedBody = await req.json();
    const { fullName, location, phoneNumber, avatarUrl } = unparsedBody;

    // Kullaniciyi dogrudan dogrulanmis IDsine göre guncelle (URL'den parametre almadan)
    const updatedUser = await prisma.user.update({
      where: { id: authenticatedId },
      data: {
        ...(fullName && { fullName }),
        ...(location !== undefined && { location }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword, { status: 200 });

  } catch (error) {
    console.error('Update User Profile Error:', error);
    
    return NextResponse.json(
      { message: 'Basarisiz islem. Guncellenecek kullanici profili bulunamamis olabilir.' },
      { status: 500 }
    );
  }
}
