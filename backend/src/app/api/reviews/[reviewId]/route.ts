import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { reviewId } = resolvedParams;
    
    // 1. Yetkilendirme (Auth Kontrolü)
    const reviewerId = getUserIdFromRequest(req);
    
    if (!reviewerId) {
      return NextResponse.json({ error: "Lütfen önce giriş yapın." }, { status: 401 });
    }

    // 2. Yorumun veritabanında var olup olmadığını ve sahipliğini kontrol et
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { reviewerId: true }
    });

    if (!review) {
      return NextResponse.json({ error: "Güncellenecek yorum bulunamadı." }, { status: 404 });
    }

    // Görev 16: Öğesinin (Owner/Reviewer) kendi yorumunu güncelleyebilmesi kontrolü
    if (review.reviewerId !== reviewerId) {
      return NextResponse.json({ error: "Bu işlemi yapmaya yetkiniz yok (Sadece kendi yaptığınız yorumları düzenleyebilirsiniz)." }, { status: 403 });
    }

    // 3. JSON parametrelerini al
    const body = await req.json();
    const { rating, comment } = body;

    // Basit geçerlilik (validation) kontrolü
    if (rating && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Değerlendirme (rating) 1 ile 5 arasında sayısal bir değer olmalıdır." }, { status: 400 });
    }

    // 4. Veritabanında güncelle
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating !== undefined ? parseInt(rating.toString()) : undefined,
        comment: comment !== undefined ? comment : undefined,
      }
    });

    return NextResponse.json(updatedReview, { status: 200 });

  } catch (error: any) {
    console.error("Yorum güncellenirken sunucu hatası:", error);
    return NextResponse.json({ error: "İç sunucu hatası" }, { status: 500 });
  }
}
