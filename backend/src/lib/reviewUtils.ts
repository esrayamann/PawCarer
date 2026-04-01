import prisma from '@/lib/prisma';

/**
 * Calculates the average stellar rating for a sitter based on their reviews.
 * Can be used by Toprak's GET /sitters endpoints to fetch the average rating (Req 6)
 */
export async function getSitterAverageRating(sitterId: string): Promise<number> {
  const reviewsData = await prisma.review.aggregate({
    where: { sitterId: sitterId },
    _avg: {
      rating: true,
    },
    _count: {
      _all: true,
    }
  });

  const rawAvg = reviewsData._avg.rating;
  
  if (rawAvg === null || rawAvg === undefined) {
    return 0;
  }
  
  // Rakamı virgülden sonra örneğin tek hane (4.8) olacak şekilde set edebiliriz
  return parseFloat(Number(rawAvg).toFixed(1));
}

/**
 * Gets total review count for a sitter
 */
export async function getSitterTotalReviewsCount(sitterId: string): Promise<number> {
  const reviewsCount = await prisma.review.count({
    where: { sitterId: sitterId },
  });

  return reviewsCount;
}
