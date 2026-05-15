import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { publishMessage, QUEUES } from '@/lib/rabbitmq';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fullName, role, location } = body;

    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { message: 'Lütfen zorunlu alanları (email, password, fullName, role) doldurunuz.' },
        { status: 400 }
      );
    }

    if (role !== 'OWNER' && role !== 'SITTER') {
      return NextResponse.json(
        { message: 'Tanımsız rol! Lütfen OWNER veya SITTER seçiniz.' },
        { status: 400 }
      );
    }

    // Kullanıcının kayıtlı olup olmadığını kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu mail adresi ile zaten bir kayıt bulunmaktadır.' },
        { status: 400 }
      );
    }

    // Şifreyi şifreleme
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Kullanıcı Oluştur
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role,
        location
      }
    });

    // Eğer rol SITTER ise, varsayılan bir SitterProfile oluştur
    if (role === 'SITTER') {
      await prisma.sitterProfile.create({
        data: {
          userId: newUser.id,
          acceptedPetTypes: [],
          acceptedPetBreeds: [],
        }
      });
    }

    // UI'a veya Postman'e şifreyi geri döndürme
    const { password: _, ...userWithoutPassword } = newUser;

    // ─── RabbitMQ: Kullanıcı kaydı bildirimi ───
    await publishMessage(QUEUES.USER_REGISTERED, {
      event: 'user_registered',
      userId: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      location: newUser.location || null,
    });

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { message: 'Kullanıcı oluşturulurken bir hata meydana geldi.' },
      { status: 500 }
    );
  }
}
