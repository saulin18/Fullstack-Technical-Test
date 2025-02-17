import useAuthStore from "../stores/authStore";
import { useGetOffers, useCreateOffer, useUpdateOffer } from "../hooks/offers";

import { Offer } from "../types/types";
import {
  useAddCategoryToOffer,
  useRemoveCategoryFromOffer,
} from "../hooks/categories";
import { useState } from "react";
import { useCategories } from "../hooks/categories";



export const useOfferActions = () => {
  const { user } = useAuthStore();
  const { data: offers } = useGetOffers();
  const createMutation = useCreateOffer();
  const updateMutation = useUpdateOffer();


  const handleCreate = async (formData: FormData) => {
    try {
      if (!user?.id) throw new Error("Debes iniciar sesión");

      const newOffer = {
        title: formData.get("title") as string,
        shortDesc: formData.get("shortDesc") as string,
        description: formData.get("description") as string,
        placeName: formData.get("placeName") as string,
        image: formData.get("image") as string,
        location: formData.get("location") as string,
        price: parseFloat(formData.get("price") as string),
        discount: formData.get("discount")
          ? Number(formData.get("discount"))
          : null,
        userId: user.id,
      };

      await createMutation.mutateAsync(newOffer as any);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleUpdate = async (id: number, formData: FormData) => {
    try {
      const updatedOffer = {
        title: formData.get("title") as string,
        shortDesc: formData.get("shortDesc") as string,
        description: formData.get("description") as string,
        placeName: formData.get("placeName") as string,
        image: formData.get("image") as string,
        location: formData.get("location") as string,
        price: parseFloat(formData.get("price") as string),
        discount: formData.get("discount")
          ? Number(formData.get("discount"))
          : null,
      };

      await updateMutation.mutateAsync({ id, offerData: updatedOffer } as any);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };



  return {
    offers:
      (Array.isArray(offers) &&
        offers?.filter((offer) => offer.deleted === false)) ||
      [],
    handleCreate,
    handleUpdate,
  };
};

export const useCategoryActions = (selectedOffer: Offer | null) => {
  const { mutateAsync: addCategoryToOffer } = useAddCategoryToOffer();
  const { mutateAsync: removeCategoryFromOffer } = useRemoveCategoryFromOffer();

  const handleAddCategory = async (categoryId: number) => {
    if (!selectedOffer) return false;

    try {
      await addCategoryToOffer({
        offerId: selectedOffer.id,
        categoryId,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleRemoveCategory = async () => {
    if (!selectedOffer) return false;

    try {
      await removeCategoryFromOffer(selectedOffer.id);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return {
    handleAddCategory,
    handleRemoveCategory,
  };
};

export const useDashboard = () => {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [modalType, setModalType] = useState<
    | "create"
    | "edit"
    | "addCategory"
    | "removeCategory"
    | "createCategory"
    | "deleteCategory"
    | null
  >(null);

  const { data: categories } = useCategories();
  const { offers, handleCreate, handleUpdate } =
    useOfferActions();
  const { handleAddCategory, handleRemoveCategory } =
    useCategoryActions(selectedOffer);

  return {
    state: {
      offers,
      categories: categories || [],
      selectedOffer,
      modalType,
    },
    actions: {
      setSelectedOffer,
      setModalType,
      handleCreate,
      handleUpdate,
      handleAddCategory,
      handleRemoveCategory,
    },
  };
};
