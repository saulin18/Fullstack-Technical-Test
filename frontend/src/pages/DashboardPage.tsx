import { useState } from "react";
import { CreateOfferInput, Offer } from "../types/types";
import {
  useGetOffers,
  useCreateOffer,
  useUpdateOffer,
  useDeleteOffer,
} from "../hooks/offers";
import {
  useAddCategoryToOffer,
  useCategories,
  useRemoveCategoryFromOffer,
} from "../hooks/categories";
import { OfferCard } from "../components/OfferCard";
import { OfferForm } from "../components/OfferForm";
import { OfferModal } from "../components/OfferModal";
import { toast, Toaster } from "sonner";
import useAuthStore from "../stores/authStore";
import { AddCategoryModal } from "../components/AddCategoryModal";
import { RemoveCategoryModal } from "../components/RemoveCategoryModal";
import { CreateCategoryModal } from "../components/CreateCategoryModal";
import { DeleteCategoryModal } from "../components/DeleteCategoryModal";
import { z } from "zod";

export default function DashboardPage() {
  const { data: offers } = useGetOffers();
  const { data: categories } = useCategories();
  const { user } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [addingCategoryOffer, setAddingCategoryOffer] = useState<Offer | null>(
    null
  );
  const [removingCategoryOffer, setRemovingCategoryOffer] =
    useState<Offer | null>(null);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);

  const createMutation = useCreateOffer();
  const updateMutation = useUpdateOffer();
  const deleteMutation = useDeleteOffer();
  const { mutateAsync: addCategoryToOffer } = useAddCategoryToOffer();
  const { mutateAsync: removeCategoryFromOffer } = useRemoveCategoryFromOffer();

  const OfferSchema = z.object({
    title: z.string().min(3),
    shortDesc: z.string().min(3),
    description: z.string().min(3),
    placeName: z.string().min(3),
    image: z.string(),
    location: z.string().min(3),
    price: z.number().positive(),
    discount: z.number().optional(),
    userId: z.number().positive(),
  });

  const handleCreate = async (formData: FormData) => {
    try {
      if (!user?.id) {
        toast.error("Debes iniciar sesión para crear ofertas");
        return;
      }

      const newOffer = formDataToObject(formData) as CreateOfferInput;

      const parsedOffer = OfferSchema.parse(newOffer);

      await createMutation.mutateAsync(parsedOffer);
      toast.success("Oferta creada exitosamente");
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Error al crear la oferta");
      console.error(error);
    }
  };

  const handleUpdate = async (id: number, formData: FormData) => {
    try {
      const updatedOffer = formDataToObject(formData);
      await updateMutation.mutateAsync({ id, offerData: updatedOffer });
      toast.success("Oferta actualizada exitosamente");
      setEditingOffer(null);
    } catch (error) {
      toast.error("Error al actualizar la oferta");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Oferta eliminada exitosamente");
    } catch (error) {
      toast.error("Error al eliminar la oferta");
    }
  };

  const formDataToObject = (formData: FormData) => ({
    title: formData.get("title") as string,
    shortDesc: formData.get("shortDesc") as string,
    description: formData.get("description") as string,
    image: formData.get("image") as string,
    placeName: formData.get("placeName") as string,
    location: formData.get("location") as string,
    price: parseFloat(formData.get("price") as string),
    discount: formData.get("discount")
      ? Number(formData.get("discount"))
      : null,
    userId: user?.id,
  });

  const handleAddCategory = async (categoryId: number) => {
    if (!addingCategoryOffer) return;

    try {
      await addCategoryToOffer({
        offerId: addingCategoryOffer.id,
        categoryId,
      });
      toast.success("Categoría agregada correctamente");
      setAddingCategoryOffer(null);
    } catch (error) {
      toast.error("Error al agregar categoría");
    }
  };

  const handleRemoveCategory = async () => {
    if (!removingCategoryOffer) return;

    try {
      await removeCategoryFromOffer(removingCategoryOffer.id);
      toast.success("Categoría eliminada correctamente");
      setRemovingCategoryOffer(null);
    } catch (error) {
      toast.error("Error al eliminar categoría");
    }
  };

  const offersToShow = offers?.filter((offer) => offer.deleted === false);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard de Ofertas
          </h1>
          <a className="text-gray-900" href="/">
            Ir al home
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Toaster />

        <div className="mb-2 flex flex-col sm:flex-row gap-2 justify-start md:justify-end">
          <button
            onClick={() => setIsCreateCategoryModalOpen(true)}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Nueva Categoría
          </button>
          <button
            onClick={() => setIsDeleteCategoryModalOpen(true)}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Eliminar Categoría
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Nueva Oferta
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offersToShow?.map((offer: Offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onEdit={setEditingOffer}
              onDelete={handleDelete}
              onAddCategory={setAddingCategoryOffer}
              onRemoveCategory={setRemovingCategoryOffer}
            />
          ))}
        </div>

        {isCreateModalOpen && (
          <OfferModal
            title="Crear Nueva Oferta"
            onClose={() => setIsCreateModalOpen(false)}
          >
            <OfferForm
              onSubmit={async (e) => {
                const formData = new FormData(e.currentTarget);
                await handleCreate(formData);
              }}
            />
          </OfferModal>
        )}

        {editingOffer && (
          <OfferModal
            title="Editar Oferta"
            onClose={() => setEditingOffer(null)}
          >
            <OfferForm
              offer={editingOffer}
              onSubmit={async (e) => {
                const formData = new FormData(e.currentTarget);
                await handleUpdate(editingOffer.id, formData);
              }}
            />
          </OfferModal>
        )}

        {addingCategoryOffer && (
          <AddCategoryModal
            categories={categories}
            onClose={() => setAddingCategoryOffer(null)}
            onSubmit={handleAddCategory}
          />
        )}

        {removingCategoryOffer && (
          <RemoveCategoryModal
            offer={removingCategoryOffer}
            onClose={() => setRemovingCategoryOffer(null)}
            onSubmit={handleRemoveCategory}
          />
        )}

        {isCreateCategoryModalOpen && (
          <CreateCategoryModal
            onClose={() => setIsCreateCategoryModalOpen(false)}
          />
        )}

        {isDeleteCategoryModalOpen && (
          <DeleteCategoryModal
            categories={categories}
            onClose={() => setIsDeleteCategoryModalOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
