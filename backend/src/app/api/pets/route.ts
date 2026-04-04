import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

// GET /api/pets — oturum açmış kullanıcının petlerini döner
export async function GET(req: NextRequest) {
  try {
    const ownerId = getUserIdFromRequest(req);
    if (!ownerId) {
      return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
    }

    const pets = await prisma.pet.findMany({
      where: { ownerId },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(pets);
  } catch (error: any) {
    console.error("Petler yüklenirken hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST /api/pets — yeni pet oluştur
export async function POST(req: NextRequest) {
  try {
    const ownerId = getUserIdFromRequest(req);

    if (!ownerId) {
      return NextResponse.json(
        { error: "Kayıt bulunamadı. Lütfen giriş yapın." },
        { status: 401 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: ownerId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı veya oturumunuz geçersiz." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, petType, breed, age, notes } = body;

    if (!name || !petType || !breed) {
      return NextResponse.json(
        { error: "'name', 'petType' ve 'breed' alanları zorunludur." },
        { status: 400 }
      );
    }

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

    return NextResponse.json(newPet, { status: 201 });

  } catch (error: any) {
    console.error("Pet oluşturulurken hata oluştu:", error);
    return NextResponse.json(
      { error: "İç sunucu hatası (Internal Server Error)" },
      { status: 500 }
    );
  }
}
