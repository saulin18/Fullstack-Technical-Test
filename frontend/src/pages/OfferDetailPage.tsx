import { useParams } from "react-router-dom";
import { useGetOfferById } from "../hooks/offers";
import { OfferCard } from "../components/offers/OfferCard";
import useOffersStore from "../stores/offersStore";

export default function OfferDetailPage() {
  const { id } = useParams();
  const { data: MyOffer } = useGetOfferById(parseInt(id as string));
  const { offers } = useOffersStore()

  if (!MyOffer) {
    return <div>Cargando...</div>;
  }

  const recommendedOffers = offers.filter((offer) => {
    offer.category?.name === MyOffer.category?.name
  })

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oferta {MyOffer.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OfferCard offer={MyOffer} isDetail />
      </div>

      <div className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} isDetail/>
      ))}
      </div>


      <div className="mt-8 flex justify-center">
        <button
          onClick={() => window.location.href = "/"}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Volver al inicio
        </button>
      </div>
    </section>
  );
}
