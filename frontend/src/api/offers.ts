import { apiWithoutAuth } from "./axiosConfig";
import { api } from "./axiosConfig";
import { CreateOfferInput, Offer } from "../types/types";

export const getOffers = async () => {
  const { data } = await apiWithoutAuth.get<Offer[]>(
    `/offers`
  );
  return data;
};

export const getOfferById = async (id: number) => {
  const { data } = await apiWithoutAuth.get<Offer>(
    `/offers/${id}`
  );
  return data;
};

export const createOffer = async (offerData: CreateOfferInput) => {
  const { data } = await api.post<Offer>(
    `/offers`,
    offerData
  );
  return data;
};

export const updateOffer = async ({
  id,
  offerData,
}: {
  id: number;
  offerData: Omit<Offer, "id">;
}) => {
  const { data } = await api.put<Offer>(
    `/offers/${id}`,
    offerData
  );
  return data;
};

export const deleteOffer = async (id: number) => {
  await api.patch(`/offers/${id}`);
};

export const getOffersByCategory = async (categoryId: number) => {
  const { data } = await api.get<Offer[]>(
    `/offers/category/${categoryId}`
  );
  return data;
};
