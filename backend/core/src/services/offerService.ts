
import { OfferRepository } from "../repositories/offerRepository";
import { Offer, CreateOfferInput, UpdateOfferInput } from "../types/types";

export class OfferService {
  constructor(private offerRepository: OfferRepository) {}

  async getAll(): Promise<Offer[]> {
    return this.offerRepository.getOffers();
  }

  async getById(id: number): Promise<Offer | null> {
    return this.offerRepository.getOfferById(id);
  }

  async create(CreateOfferInput: CreateOfferInput): Promise<Offer> {
    return this.offerRepository.createOffer(CreateOfferInput);
  }

  async update(id: number, UpdateOfferInput: UpdateOfferInput): Promise<Offer> {
    return this.offerRepository.updateOffer(id, UpdateOfferInput);
  }

  async delete(id: number): Promise<Offer> {
    return this.offerRepository.deleteOffer(id);
  }

  async getOffersByCategory(categoryId: number): Promise<Offer[]> {
    return this.offerRepository.getOffersByCategory(categoryId);
  }

  async removeCategoryFromOffer(offerId: number): Promise<Offer> {
    return this.offerRepository.removeCategoryFromOffer(offerId);
  }

}