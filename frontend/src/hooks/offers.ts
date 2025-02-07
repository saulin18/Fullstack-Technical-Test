import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getOffers, 
  getOfferById, 
  createOffer, 
  updateOffer, 
  deleteOffer 
} from "../api/offers";

import { toast } from "sonner";
import { api } from "../api/axiosConfig";
import { Offer } from "../types/types";

export const useGetOffers = () => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: getOffers,
    retry: false,
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al cargar ofertas");
    },
  } as any);
};

export const useGetOfferById = (id: number) => {
  return useQuery({
    queryKey: ["offer", id],
    queryFn: () => getOfferById(id),
    enabled: !!id,
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al cargar oferta");
    },
  } as any); 
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOffer,
    onSuccess: (data: Offer) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.setQueryData(["offers"], (old: any[]) => [...old, data]);
      toast.success("Oferta creada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al crear oferta");
    }
  } as any);
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOffer,
    onSuccess: (data: Offer) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.setQueryData(["offer", data.id], data);
      toast.success("Oferta actualizada correctamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al actualizar oferta");
    }
  } as any); 
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOffer(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Oferta eliminada correctamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al eliminar oferta");
    }
  } as any); 
};

export const useRemoveCategoryFromOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerId: number) => {
      const { data } = await api.delete(`/offers/${offerId}/category`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Categoría removida de la oferta");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al remover categoría");
    }
  } as any);
};
