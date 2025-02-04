import { PrismaClient, Category, Prisma, Offer } from "@prisma/client";

export class CategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async create(categoryData: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({
      data: categoryData,
    });
  }

  async delete(id: number): Promise<Category> {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async addToOffer(categoryId: number, offerId: number): Promise<Offer> {
    return this.prisma.offer.update({
      where: { id: offerId },
      data: {
        categoryId: categoryId
      },
      include: {
        category: true
      }
    });
  }

}
