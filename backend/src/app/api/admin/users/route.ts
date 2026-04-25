import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

// GET /api/admin/users — Admin: tüm kullanıcıları listele
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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        location: true,
        phoneNumber: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Admin GET Users Error:', error);
    return NextResponse.json({ message: 'Sunucu hatası.' }, { status: 500 });
  }
}
