import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOffers, getOfferById, createOffer, updateOffer, deleteOffer, } from "../api/offers";
import { queryClient } from "../main";


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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};

export const useUpdateOffer = () => {
  return useMutation({
    mutationFn: updateOffer,
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
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

