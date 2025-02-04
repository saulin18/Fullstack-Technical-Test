import { Modal } from "./Modal";
import { Category } from "../types/types";
import { useDeleteCategory } from "../hooks/categories";

export const DeleteCategoryModal = ({
  categories,
  onClose,
}: {
  categories?: Category[];
  onClose: () => void;
}) => {
  const deleteCategory = useDeleteCategory();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryId = parseInt(formData.get("categoryId") as string);
    
    if (categoryId) {
      deleteCategory.mutate(categoryId);
      onClose();
    }
  };

  return (
    <Modal title="Eliminar Categoría" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Seleccionar categoría a eliminar
          </label>
          <select
            name="categoryId"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
        >
          Eliminar Categoría
        </button>
      </form>
    </Modal>
  );
};