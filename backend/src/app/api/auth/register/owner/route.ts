import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fullName, location } = body;

    // Role is automatically OWNER for this route
    const role = 'OWNER';

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: 'Lütfen zorunlu alanları (email, password, fullName) doldurunuz.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu mail adresi ile zaten bir kayıt bulunmaktadır.' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role,
        location
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Owner Registration API Error:', error);
    return NextResponse.json(
      { message: 'Hayvan Sahibi oluşturulurken bir hata meydana geldi.' },
      { status: 500 }
    );
  }
}
