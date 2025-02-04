
import { PrismaClient, Offer } from '@prisma/client';
import { CreateOfferInput, UpdateOfferInput } from '../types/types';

export class OfferRepository {
  constructor(private prisma: PrismaClient) {}

  async getOffers(): Promise<Offer[]> {
    return this.prisma.offer.findMany({
      include: {
        category: true,
        user: true,
      },
    });
  }

  async getOfferById(id: number): Promise<Offer | null> {
    return this.prisma.offer.findUnique({
      where: { id },
      include: {
        category: true,
        user: true,
      },
    });
  }

  async createOffer(offerData: CreateOfferInput): Promise<Offer> {
    return this.prisma.offer.create({
      data: {
        ...offerData,
        discount: offerData.discount ?? null,
      },
    });
  }

  async updateOffer(id: number, offerData: UpdateOfferInput): Promise<Offer> {
    const filteredData = this.filterUndefined(offerData);
    
    return this.prisma.offer.update({
      where: { id },
      data: {
        ...filteredData,
        discount: offerData.discount ?? null,
      },
    });
  }

  async deleteOffer(id: number): Promise<Offer> {
    return this.prisma.offer.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async getOffersByCategory(categoryId: number): Promise<Offer[]> {
    return this.prisma.offer.findMany({
      where: { categoryId },
      include: { category: true },
    });
  }

  private filterUndefined<T extends object>(data: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    ) as Partial<T>;
  }
}