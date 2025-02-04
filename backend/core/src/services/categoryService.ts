import { Prisma } from "@prisma/client";
import { CategoryRepository } from "../repositories/categoryRepository";
import { Category, Offer } from "../types/types";

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getAll(): Promise<Category[]> {
    return this.categoryRepository.getAll();
  }

  async create(categoryData: Prisma.CategoryCreateInput): Promise<Category> {
    return this.categoryRepository.create(categoryData);
  }

  async delete(id: number): Promise<Category> {
    return this.categoryRepository.delete(id);
  }

  async addToOffer(offerId: number, categoryId: number): Promise<Category> {
    return this.categoryRepository.addToOffer(offerId, categoryId);
  }

  async removeCategoryFromOffer(offerId: number): Promise<Offer> {
    return this.categoryRepository.removeCategoryFromOffer(offerId);
  }
}
