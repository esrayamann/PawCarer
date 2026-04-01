import { NextRequest, NextResponse } from 'next/server';
import { getSitterAverageRating, getSitterTotalReviewsCount } from '@/lib/reviewUtils';

interface Params {
  sitterId: string;
}

export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const p = await params;
    const { sitterId } = p;
    
    // Yardımcı fonksiyondan veritabanı ortalamasını çekiyoruz
    const averageRating = await getSitterAverageRating(sitterId);
    const totalReviews = await getSitterTotalReviewsCount(sitterId);

    return NextResponse.json({
      sitterId,
      averageRating,
      totalReviews
    }, { status: 200 });

  } catch (error) {
    console.error('Sitter Rating API Error:', error);
    
    return NextResponse.json(
      { message: 'Bakıcı puanı hesaplanırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
