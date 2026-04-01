import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // URL sorgu parametrelerinden filtreleri okuyoruz
  const location = searchParams.get("location");
  const petType = searchParams.get("petType");
  const petBreed = searchParams.get("petBreed");

  // Prisma sorgusu için dinamik where koşulu
  let whereClause: any = {};
  
  // Konuma göre filtreleme (Gereksinim 10)
  if (location) {
    whereClause.user = { 
        location: { contains: location, mode: 'insensitive' } 
    };
  }
  
  // Hayvan Türüne (Kedi, Köpek) göre filtreleme (Gereksinim 11)
  if (petType) {
    whereClause.acceptedPetTypes = { has: petType };
  }
  
  // Hayvan Cinsine göre filtreleme (Gereksinim 12)
  if (petBreed) {
    whereClause.acceptedPetBreeds = { has: petBreed };
  }

  try {
    // Veritabanından belirtilen kriterlere sahip bakıcıları ve 
    // ilişkili user ve review (yorum) tablolarını çekiyoruz
    const sitters = await prisma.sitterProfile.findMany({
      where: whereClause,
      include: {
        user: { 
            select: { fullName: true, location: true } 
        },
        reviewsReceived: { 
            select: { rating: true } 
        }
      }
    });

    // Her bakıcı için yorum ortalamasını hesaplayıp response objesini dönüştürüyoruz
    const enrichedSitters = sitters.map((sitter: any) => {
      const totalReviews = sitter.reviewsReceived.length;
      const averageRating = totalReviews > 0 
        ? sitter.reviewsReceived.reduce((prev: number, curr: { rating: number }) => prev + curr.rating, 0) / totalReviews 
        : 0;
        
      return {
        id: sitter.id,
        userId: sitter.userId,
        fullName: sitter.user.fullName,
        location: sitter.user.location,
        hourlyRate: sitter.hourlyRate,
        acceptedPetTypes: sitter.acceptedPetTypes,
        acceptedPetBreeds: sitter.acceptedPetBreeds,
        bio: sitter.bio,
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: totalReviews
      };
    });

    return NextResponse.json(enrichedSitters, { status: 200 });

  } catch (error: any) {
    console.error("Bakıcı araması yapılırken bir hata oluştu:", error);
    return NextResponse.json(
      { error: "İç sunucu hatası (Internal Server Error)" },
      { status: 500 }
    );
  }
}
