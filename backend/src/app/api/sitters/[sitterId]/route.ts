import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

interface Params {
  sitterId: string;
}

// GET /api/sitters/:sitterId — herkese açık bakıcı profili
export async function GET(_req: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const { sitterId } = await params;

    const sitter = await prisma.sitterProfile.findUnique({
      where: { id: sitterId },
      include: {
        user: { select: { fullName: true, location: true } },
        reviewsReceived: {
          include: {
            reviewer: { select: { fullName: true } }
          },
          orderBy: { id: 'desc' }
        }
      }
    });

    if (!sitter) {
      return NextResponse.json({ error: 'Bakıcı bulunamadı.' }, { status: 404 });
    }

    const totalReviews = sitter.reviewsReceived.length;
    const averageRating = totalReviews > 0
      ? sitter.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    return NextResponse.json({
      id: sitter.id,
      userId: sitter.userId,
      fullName: sitter.user.fullName,
      location: sitter.user.location,
      hourlyRate: sitter.hourlyRate,
      acceptedPetTypes: sitter.acceptedPetTypes,
      acceptedPetBreeds: sitter.acceptedPetBreeds,
      bio: sitter.bio,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
      reviews: sitter.reviewsReceived.map(r => ({
        id: r.id,
        reviewerId: r.reviewerId,
        rating: r.rating,
        comment: r.comment,
        reviewerName: r.reviewer?.fullName || 'Anonim'
      }))
    });
  } catch (error) {
    console.error('Get sitter error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
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
