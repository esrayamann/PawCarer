import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Authorization token dogrulamasi
    const authenticatedId = getUserIdFromRequest(req);
    
    if (!authenticatedId) {
      return NextResponse.json({ message: 'Lutfen yorum yapmak icin giris yapiniz.' }, { status: 401 });
    }

    const { sitterId, rating, comment } = await req.json();

    if (!sitterId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Geçersiz veri: sitterId ve yıldız derecesi (rating: 1-5) zorunludur.' },
        { status: 400 }
      );
    }

    const sitterExists = await prisma.sitterProfile.findUnique({
      where: { id: sitterId }
    });

    if (!sitterExists) {
      return NextResponse.json({ message: 'Belirtilen bakici bulunamadi.' }, { status: 404 });
    }

    const newReview = await prisma.review.create({
      data: {
        sitterId,
        reviewerId: authenticatedId,
        rating,
        comment
      }
    });

    return NextResponse.json(newReview, { status: 201 });

  } catch (error) {
    console.error('Create Review Parameter Error:', error);
    
    return NextResponse.json(
      { message: 'Yorum kaydedilirken bir hata olustu.' },
      { status: 500 }
    );
  }
}
