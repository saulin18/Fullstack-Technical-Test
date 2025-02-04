import { create } from "zustand";
import { Offer } from "../types/types";

interface OffersStore {
  offers: Offer[];
  isLoading: boolean;
  selectedCategory: string;
  addOffer: (offer: Offer) => Promise<void>;
  updateOffer: (offer: Offer) => Promise<void>;
  deleteOffer: (id: number) => Promise<void>;
  setOffers: (offers: Offer[]) => void;
}

const useOffersStore = create<OffersStore>((set) => ({
  offers: [],
  isLoading: true,
  selectedCategory: "all",
  addOffer: async (offer: Offer) => {
    set((state) => ({ offers: [...state.offers, offer] }));
  },
  updateOffer: async (offer: Offer) => {
    set((state) => ({
      offers: state.offers.map((o) => (o.id === offer.id ? offer : o)),
    }));
  },
  deleteOffer: async (id: number) => {
    set((state) => ({
      offers: state.offers.filter((o) => o.id !== id),
    }));
  },
  setOffers: (offers: Offer[]) => set({ offers }),
}));

export default useOffersStore;      