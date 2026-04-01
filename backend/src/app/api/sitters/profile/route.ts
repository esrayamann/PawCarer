import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    // Authorization token dogrulamasi
    const authenticatedId = getUserIdFromRequest(req);
    
    if (!authenticatedId) {
      return NextResponse.json({ message: 'Yetkisiz islem. Lutfen giris yapiniz.' }, { status: 401 });
    }

    // Doğrudan sisteme kimlik dogrulamayla girmis kisinin `sitterProfile`'ini bul
    const currentSitter = await prisma.sitterProfile.findUnique({
      where: { userId: authenticatedId },
    });

    if (!currentSitter) {
      return NextResponse.json({ message: 'Size ait bir bakici profili bulunamadi.' }, { status: 404 });
    }

    const unparsedBody = await req.json();
    const { hourlyRate, acceptedPetTypes, acceptedPetBreeds, bio } = unparsedBody;

    // Sitter tablosunu kendi ID'si üzerinden guncelle
    const updatedSitter = await prisma.sitterProfile.update({
      where: { id: currentSitter.id },
      data: {
        ...(hourlyRate !== undefined && { hourlyRate }),
        ...(acceptedPetTypes !== undefined && { acceptedPetTypes }),
        ...(acceptedPetBreeds !== undefined && { acceptedPetBreeds }),
        ...(bio !== undefined && { bio }),
      }
    });

    return NextResponse.json(updatedSitter, { status: 200 });

  } catch (error) {
    console.error('Update Sitter Profile Error:', error);
    
    return NextResponse.json(
      { message: 'Basarisiz islem. Profil güncellenirken sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
