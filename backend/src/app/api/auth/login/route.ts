import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Geçersiz veri: email ve password zorunludur.' },
        { status: 400 }
      );
    }

    // Kullanıcıyı emailden bul
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Yetkisiz giriş: email veya şifre hatalı.' },
        { status: 401 }
      );
    }

    // Şifreyi karşılaştır
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Yetkisiz giriş: email veya şifre hatalı.' },
        { status: 401 }
      );
    }

    // JWT Token yarat
    const token = generateToken(user.id, user.role);

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        token,
        user: userWithoutPassword
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { message: 'Giriş işlemi sırasında sunucu hatası.' },
      { status: 500 }
    );
  }
}
