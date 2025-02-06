import { useState, useEffect } from "react";
import { OfferCard } from "../components/offers/OfferCard";
import { useGetOffers } from "../hooks/offers";
import { useCategories } from "../hooks/categories";
import useCategoriesStore from "../stores/categoriesStore";
import AdminDashboardButton from "../components/DashboardButton";
import { Link, Navigate } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import useAuthStore from "../stores/authStore";

export default function HomePage() {
  const { data: offers, isLoading, isError } = useGetOffers();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: categoriesData } = useCategories();
  const { categories, setCategories } = useCategoriesStore();

  const categoryNames = ["all", ...categories.map((c) => c.name)];

  const categoryNamesWithoutDuplicates = categoryNames.filter(
    (value, index, self) => self.indexOf(value) === index
  );

  const { user } = useAuthStore();

    if (!user) {
      return <Navigate to="/auth/login" />;
    }

    console.log(user.username)

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData, setCategories]);

  const filteredOffers =
    selectedCategory === "all"
      ? offers || []
      : offers?.filter((offer) => offer.category?.name === selectedCategory) ||
        [];

  const offersWithoutDuplicates = filteredOffers?.filter(
    (offer, index, self) => self.findIndex((o) => o.id === offer.id) === index
  );

  const offersToShow = offersWithoutDuplicates?.filter(
    (offer) => offer.deleted === false
  );

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 text-lg">Error cargando las ofertas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ofertas Especiales
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {categoryNamesWithoutDuplicates.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    selectedCategory === category
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {category === "all" ? "Todas" : category}
              </button>
            ))}
          </div>
        </div>{" "}
        <div className="flex flex-row mb-4 gap-3 items-center">
          {user && user.role === "admin" && <AdminDashboardButton />}{" "}
          <Link
            to="/auth/register"
            className="text-gray-900  text-sm font-medium"
          >
            Registrarse
          </Link>
          <Link to="/auth/login" className="text-gray-900 text-sm font-medium">
            Iniciar Sesión
          </Link>{" "}
        </div>
        {offersToShow.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron ofertas en esta categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offersToShow?.map((offer) => (
              <Link key={offer.id} to={`/offers/${offer.id}`} className="block">
                <OfferCard key={offer.id} offer={offer} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
