import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

interface Params {
  sitterId: string;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const p = await params;
    const { sitterId } = p;
    
    // Authorization token dogrulamasi
    const authenticatedId = getUserIdFromRequest(req);
    
    if (!authenticatedId) {
      return NextResponse.json({ message: 'Yetkisiz islem. Lutfen giris yapiniz.' }, { status: 401 });
    }

    // Guncellenecek Sitter nesnesini cekiyoruz ki userid'si authenticatedId ile uyusuyor mu teyit edelim
    const currentSitter = await prisma.sitterProfile.findUnique({
      where: { id: sitterId },
    });

    if (!currentSitter) {
      return NextResponse.json({ message: 'Sitter profili bulunamadi.' }, { status: 404 });
    }

    if (currentSitter.userId !== authenticatedId) {
      return NextResponse.json({ message: 'Bu Sitter profilini guncelleme yetkiniz yok.' }, { status: 403 });
    }

    const unparsedBody = await req.json();
    const { hourlyRate, acceptedPetTypes, acceptedPetBreeds, bio } = unparsedBody;

    // Sitter tablosunu guncelle
    const updatedSitter = await prisma.sitterProfile.update({
      where: { id: sitterId },
      data: {
        ...(hourlyRate !== undefined && { hourlyRate }),
        ...(acceptedPetTypes !== undefined && { acceptedPetTypes }),
        ...(acceptedPetBreeds !== undefined && { acceptedPetBreeds }),
        ...(bio !== undefined && { bio }),
      }
    });

    return NextResponse.json(updatedSitter, { status: 200 });

  } catch (error) {
    console.error('Update Sitter Details Error:', error);
    
    return NextResponse.json(
      { message: 'Basarisiz islem. Guncellenecek bakici bulunamamis olabilir.' },
      { status: 500 }
    );
  }
}
