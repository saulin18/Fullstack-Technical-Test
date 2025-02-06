import { Offer } from "../../types/types";
import { Modal } from "../Modal";


export const RemoveCategoryModal = ({
  offer,
  onClose,
  onSubmit,
}: {
  offer: Offer;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  return (
    <Modal title="Eliminar Categoría" onClose={onClose}>
      <div className="space-y-4">
        <p>¿Estás seguro de eliminar la categoría "{offer.category?.name}"?</p>
        <button
          onClick={onSubmit}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Eliminar
        </button>
      </div>
    </Modal>
  );
};