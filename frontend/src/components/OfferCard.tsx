import { Offer } from "../types/types";

interface OfferCardProps {
  offer: Offer;
  onEdit?: (offer: Offer) => void;
  onDelete?: (id: number) => void;
  onAddCategory?: (offer: Offer) => void;
  onRemoveCategory?: (offer: Offer) => void;
  isDetail?: boolean;
}

export function OfferCard({
  offer,
  onEdit,
  onDelete,
  onAddCategory,
  onRemoveCategory,
  isDetail,
}: OfferCardProps) {
  const discountedPrice = offer.discount
    ? offer.price * (1 - offer.discount / 100)
    : offer.price;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
      <div className="relative aspect-[16/9]">
        <img
          src={offer.image}
          alt={offer.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {offer.discount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{offer.discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {offer.title}
            </h3>
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
              {offer.category?.name}
            </span>
          </div>
          <div className="text-right">
            {offer.discount && (
              <span className="block text-sm text-gray-500 line-through">
                ${offer.price.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">
          {isDetail ? offer.description : offer.shortDesc}
        </p>
        <div className="flex items-center text-gray-500 text-sm">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {offer.placeName} - {offer.location}
        </div>
        {onEdit && (
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onEdit?.(offer)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Editar
            </button>{" "}
          </div>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete?.(offer.id)}
            className="px-3 py-1 border border-red-300 rounded-md text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar
          </button>
        )}
      </div>
      <div className=" ml-4 md:justify-start mb-4 mt-4 flex gap-2">
        {onAddCategory && (
          <button
            onClick={() => onAddCategory(offer)}
            className="text-sm bg-green-500 text-white px-3 py-1 rounded"
          >
            {offer.categoryId ? "Cambiar Categoría" : "Agregar Categoría"}
          </button>
        )}

        {onRemoveCategory && offer.categoryId && (
          <button
            onClick={() => onRemoveCategory(offer)}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded"
          >
            Quitar Categoría
          </button>
        )}
      </div>
    </div>
  );
}
