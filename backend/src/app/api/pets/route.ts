import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Kullanıcıyı Authenticate (Kimlik Doğrulama) et
    const ownerId = getUserIdFromRequest(req);
    
    if (!ownerId) {
      return NextResponse.json(
        { error: "Kayıt bulunamadı. Lütfen giriş yapın." },
        { status: 401 }
      );
    }

    // Gerçek bir kullanıcı var mı kontrol et (Test ve Demo için opsiyonel)
    const existingUser = await prisma.user.findUnique({
      where: { id: ownerId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı veya oturumunuz geçersiz." },
        { status: 401 }
      );
    }

    // 2. Request body'i parse et
    const body = await req.json();
    const { name, petType, breed, age, notes } = body;

    // 3. Basit validasyon
    if (!name || !petType || !breed) {
      return NextResponse.json(
        { error: "'name', 'petType' ve 'breed' alanları zorunludur." },
        { status: 400 }
      );
    }

    // 4. Veritabanında (Prisma) yeni pet kaydını oluştur
    const newPet = await prisma.pet.create({
      data: {
        ownerId: ownerId,
        name: name,
        petType: petType,
        breed: breed,
        age: age ? parseInt(age.toString()) : null,
        notes: notes || null,
      },
    });

    // 5. 201 Created formatında yanıt dön (API Tasarımıyla aynı)
    return NextResponse.json(newPet, { status: 201 });

  } catch (error: any) {
    console.error("Pet oluşturulurken hata oluştu:", error);
    return NextResponse.json(
      { error: "İç sunucu hatası (Internal Server Error)" },
      { status: 500 }
    );
  }
}
