import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOffers, getOfferById, createOffer, updateOffer, deleteOffer, getOffersByCategory } from "../api/offers";


export const useGetOffers = () => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: getOffers,
  });
};

export const useGetOfferById = (id: number) => {
  return useQuery({
    queryKey: ["offer", id],
    queryFn: () => getOfferById(id),
  });
};

export const useCreateOffer = () => {
  return useMutation({
    mutationFn: createOffer,
  });
};

export const useUpdateOffer = () => {
  return useMutation({
    mutationFn: updateOffer,
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};

export const useGetOffersByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ["offersByCategory", categoryId],
    queryFn: () => getOffersByCategory(categoryId),
  });
};