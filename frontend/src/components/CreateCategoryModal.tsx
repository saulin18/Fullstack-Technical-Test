import { Modal } from "./Modal";
import { useCreateCategory } from "../hooks/categories";

export const CreateCategoryModal = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const createCategory = useCreateCategory();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    
    if (name) {
      createCategory.mutate({ id: 0, name }); 
      onClose();
    }
  };

  return (
    <Modal title="Crear Nueva Categoría" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre de la categoría
          </label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Crear Categoría
        </button>
      </form>
    </Modal>
  );
};