import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

// GET /api/admin/reviews — Admin: tüm yorumları listele
export async function GET(req: NextRequest) {
  try {
    const adminId = getUserIdFromRequest(req);
    if (!adminId) {
      return NextResponse.json({ message: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Bu işlem için yönetici yetkisi gereklidir.' },
        { status: 403 }
      );
    }

    const reviews = await prisma.review.findMany({
      include: {
        reviewer: {
          select: { fullName: true, email: true },
        },
        sitter: {
          include: {
            user: { select: { fullName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      reviewerName: r.reviewer?.fullName || r.reviewer?.email || 'Anonim',
      sitterName: r.sitter?.user?.fullName || 'Bilinmiyor',
      createdAt: r.createdAt,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error('Admin GET Reviews Error:', error);
    return NextResponse.json({ message: 'Sunucu hatası.' }, { status: 500 });
  }
}
