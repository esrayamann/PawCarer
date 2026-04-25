import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

// GET /api/admin/sitters — Admin: tüm bakıcıları listele
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

    const sitters = await prisma.sitterProfile.findMany({
      include: {
        user: {
          select: { fullName: true, email: true, location: true },
        },
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = sitters.map((s) => ({
      id: s.id,
      fullName: s.user?.fullName || 'İsimsiz',
      email: s.user?.email,
      location: s.user?.location,
      hourlyRate: s.hourlyRate,
      totalReviews: s._count.reviews,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error('Admin GET Sitters Error:', error);
    return NextResponse.json({ message: 'Sunucu hatası.' }, { status: 500 });
  }
}
