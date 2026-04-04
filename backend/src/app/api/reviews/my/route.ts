import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

// GET /api/reviews/my — oturum açmış kullanıcının kendi yazdığı yorumları döner
export async function GET(req: NextRequest) {
  try {
    const reviewerId = getUserIdFromRequest(req);
    if (!reviewerId) {
      return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
    }

    const reviews = await prisma.review.findMany({
      where: { reviewerId },
      orderBy: { id: "asc" },
      include: {
        sitter: {
          include: {
            user: {
              select: { fullName: true }
            }
          }
        }
      }
    });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("Yorumlar yüklenirken hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
