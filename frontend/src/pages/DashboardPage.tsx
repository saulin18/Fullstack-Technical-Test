
import { Toaster } from "sonner";
import { OfferCard } from "../components/offers/OfferCard";
import { OfferForm } from "../components/offers/OfferForm";
import { OfferModal } from "../components/offers/OfferModal";
import { AddCategoryModal } from "../components/categories/AddCategoryModal";
import { RemoveCategoryModal } from "../components/categories/RemoveCategoryModal";
import { CreateCategoryModal } from "../components/categories/CreateCategoryModal";
import { DeleteCategoryModal } from "../components/categories/DeleteCategoryModal";
import { useDashboard } from "../hooks/dashboard";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Offer } from "../types/types";

export default function DashboardPage() {
  const {
    state: { offers, categories, selectedOffer, modalType },
    actions: {
      setSelectedOffer,
      setModalType,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleAddCategory,
      handleRemoveCategory,
    },
  } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Toaster />

        <div className="mb-2 flex flex-col sm:flex-row gap-2 justify-start md:justify-end">
          <button
            onClick={() => setModalType("createCategory")}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Nueva Categoría
          </button>
          <button
            onClick={() => setModalType("deleteCategory")}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Eliminar Categoría
          </button>
          <button
            onClick={() => setModalType("create")}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Nueva Oferta
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers?.map((offer: Offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onEdit={() => {
                setSelectedOffer(offer);
                setModalType("edit");
              }}
              onDelete={handleDelete}
              onAddCategory={() => {
                setSelectedOffer(offer);
                setModalType("addCategory");
              }}
              onRemoveCategory={() => {
                setSelectedOffer(offer);
                setModalType("removeCategory");
              }}
            />
          ))}
        </div>

        {(modalType === "create" || modalType === "edit") && (
          <OfferModal
            title={modalType === "create" ? "Crear Nueva Oferta" : "Editar Oferta"}
            onClose={() => {
              setModalType(null);
              setSelectedOffer(null);
            }}
          >
            <OfferForm
              offer={selectedOffer || undefined}
              onSubmit={async (e) => {
                const formData = new FormData(e.currentTarget);
                const success = modalType === "create" 
                  ? await handleCreate(formData)
                  : selectedOffer && await handleUpdate(selectedOffer.id, formData);
                
                if (success) {
                  setModalType(null);
                  setSelectedOffer(null);
                }
              }}
            />
          </OfferModal>
        )}

        {modalType === "addCategory" && selectedOffer && (
          <AddCategoryModal
            categories={categories}
            onClose={() => setModalType(null)}
            onSubmit={async (categoryId) => {
              const success = await handleAddCategory(categoryId);
              if (success) setModalType(null);
            }}
          />
        )}

        {modalType === "removeCategory" && selectedOffer && (
          <RemoveCategoryModal
            offer={selectedOffer}
            onClose={() => setModalType(null)}
            onSubmit={async () => {
              const success = await handleRemoveCategory();
              if (success) setModalType(null);
            }}
          />
        )}

        {modalType === "createCategory" && (
          <CreateCategoryModal
            onClose={() => setModalType(null)}
          />
        )}

        {modalType === "deleteCategory" && (
          <DeleteCategoryModal
            categories={categories}
            onClose={() => setModalType(null)}
          />
        )}
      </main>
    </div>
  );
}