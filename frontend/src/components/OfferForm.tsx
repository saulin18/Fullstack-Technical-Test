import { Offer } from "../types/types";

export const OfferForm = ({ 
  offer, 
  
  onSubmit 
}: { 
  offer?: Offer; 
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void 
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <><form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
              Título
          </label>
          <input
              type="text"
              name="title"
              defaultValue={offer?.title}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      <div>
              <label className="block text-sm font-medium text-gray-700">
                  Descripción Corta
              </label>
              <textarea
                  name="shortDesc"
                  defaultValue={offer?.shortDesc}
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div><div>
              <label className="block text-sm font-medium text-gray-700">
                  Descripción Detallada
              </label>
              <textarea
                  name="description"
                  defaultValue={offer?.description}
                  required
                  rows={5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div><div>
              <label className="block text-sm font-medium text-gray-700">
                  URL de la imagen
              </label>
              <input
                  type="text"
                  name="image"
                  defaultValue={offer?.image}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
<div>
              <label className="block text-sm font-medium text-gray-700">
                  Nombre del Lugar
              </label>
              <input
                  type="text"
                  name="placeName"
                  defaultValue={offer?.placeName}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div><div>
              <label className="block text-sm font-medium text-gray-700">
                  Location
              </label>
              <input
                  type="text"
                  name="location"
                  defaultValue={offer?.location}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div><div>
              <label className="block text-sm font-medium text-gray-700">
                  Precio
              </label>
              <input
                  type="number"
                  name="price"
                  step="0.01"
                  defaultValue={offer?.price}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div><div>
              <label className="block text-sm font-medium text-gray-700">
                  Descuento (%)
              </label>
              <input
                  type="number"
                  name="discount"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={offer?.discount || 0}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div><button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
              {offer ? "Actualizar Oferta" : "Crear Oferta"}
          </button>
        
    </form></>
  );  
};