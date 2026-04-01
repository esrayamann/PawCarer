import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

interface Params {
  sitterId: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const p = await params;
    const { sitterId } = p;
    
    // Authorization token dogrulamasi
    const authenticatedId = getUserIdFromRequest(req);
    
    if (!authenticatedId) {
      return NextResponse.json({ message: 'Lutfen yorum yapmak icin giris yapiniz.' }, { status: 401 });
    }

    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Yildiz derecesi (rating) zorunludur ve 1 ile 5 arasinda olmalidir.' },
        { status: 400 }
      );
    }

    // Sitter var mı kontrol et
    const sitterExists = await prisma.sitterProfile.findUnique({
      where: { id: sitterId }
    });

    if (!sitterExists) {
      return NextResponse.json({ message: 'Belirtilen bakici bulunamadi.' }, { status: 404 });
    }

    // Ayni kullanicinin daha onceden yorumu varsa ona izin vermeyebilir ya da verdirebilir,
    // biz API spesifikasyonlarina gore birden cok yorum yapmasina engelleme koymuyoruz su anda.

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
    console.error('Create Review Error:', error);
    
    return NextResponse.json(
      { message: 'Yorum kaydedilirken bir hata olustu.' },
      { status: 500 }
    );
  }
}
