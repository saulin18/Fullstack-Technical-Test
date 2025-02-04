import { Category} from "../types/types";
import { Modal } from "./Modal";


export const AddCategoryModal = ({
  categories,
  onClose,
  onSubmit,
}: {
  categories?: Category[];
  onClose: () => void;
  onSubmit: (categoryId: number) => void;
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryId = parseInt(formData.get("categoryId") as string);
    onSubmit(categoryId);
  };

  return (
    <Modal title="Agregar Categoría" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="categoryId"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md"
        >
          Agregar
        </button>
      </form>
    </Modal>
  );
};