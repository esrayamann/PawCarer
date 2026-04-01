import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

// Parametre olarak gelen ID tipini belirtiyoruz. 
// Next.js App Router API route params interface:
interface Params {
  userId: string;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const p = await params;
    const { userId } = p;
    
    // Authorization token dogrulamasi
    const authenticatedId = getUserIdFromRequest(req);
    
    // Kullanici giris yapmamissa
    if (!authenticatedId) {
      return NextResponse.json({ message: 'Yetkisiz islem. Lutfen giris yapiniz.' }, { status: 401 });
    }

    // Kullanici kendi profilinden baskasini guncelleyemez (Admin eger yetkiliyse baska bir senaryo olmali)
    if (authenticatedId !== userId) {
      return NextResponse.json({ message: 'Bu profili guncelleme yetkiniz yok.' }, { status: 403 });
    }

    const unparsedBody = await req.json();
    const { fullName, location, phoneNumber, avatarUrl } = unparsedBody;

    // Kullaniciyi guncelle
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { fullName }),
        ...(location !== undefined && { location }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      }
    });

    // Sifreyi disari sizdirmamak icin degisken ismini deconstruct yapalim
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword, { status: 200 });

  } catch (error) {
    console.error('Update User Details Error:', error);
    
    return NextResponse.json(
      { message: 'Basarisiz islem. Guncellenecek kullanici bulunamamis olabilir.' },
      { status: 500 }
    );
  }
}
