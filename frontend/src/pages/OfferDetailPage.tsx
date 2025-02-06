import { useParams } from "react-router-dom";
import { useGetOfferById, useGetOffers } from "../hooks/offers";
import { OfferCard } from "../components/offers/OfferCard";

export default function OfferDetailPage() {
  const { id } = useParams();
  const { data: MyOffer, isLoading } = useGetOfferById(parseInt(id as string));
  const { data: offers } = useGetOffers();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!MyOffer) {
    return <div>No se encontró la oferta</div>;
  }

  const offersOfTheSameCategoryOfMyOffer = offers?.filter((offer) => {
    return (
      offer.category?.name === MyOffer.category?.name && offer.id !== MyOffer.id
    );
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oferta {MyOffer.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 self-center justify-center md:grid-cols-4 lg:grid-cols-3 gap-6">
        <OfferCard offer={MyOffer} isDetail />
      </div>

      <h4 className="text-2xl font-bold mt-5 text-gray-900 mb-4">
        Ofertas similares
      </h4>
      <div className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offersOfTheSameCategoryOfMyOffer?.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => (window.location.href = "/")}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Volver al inicio
        </button>
      </div>
    </section>
  );
}
