import { useState, useEffect } from "react"
import { OfferCard } from "../components/OfferCard"
import { Offer } from "../types/types"

export const mockOffers: Offer[] = [
    {
      id: 1,
      title: "Oferta Pizza Familiar",
      shortDescription: "Pizza margarita tamaño familiar + bebida gratis",
      imageUrl: "https://picsum.photos/200/300?food",
      category: { id: 1, name: "Food" },
      placeName: "Pizzería Napoli",
      location: "Centro Comercial MegaPlaza",
      price: 25.99,
      discount: 15,
      deleted: false,
      user_id: 1
    },
    {
      id: 2,
      title: "Laptop Gamer en Oferta",
      shortDescription: "Laptop ASUS ROG con RTX 3080 y 32GB RAM",
      imageUrl: "https://picsum.photos/200/300?tech",
      category: { id: 2, name: "Technology" },
      placeName: "Tienda TechWorld",
      location: "Avenida Principal 123",
      price: 1899.99,
      discount: 20,
      deleted: false,
      user_id: 1
    },
    {
      id: 3,
      title: "Paquete Vacacional Caribe",
      shortDescription: "7 noches todo incluido en hotel 5 estrellas",
      imageUrl: "https://picsum.photos/200/300?travel",
      category: { id: 3, name: "Travel" },
      placeName: "Agencia Viajes Felices",
      location: "Calle del Mar 456",
      price: 1200.00,
      discount: 30,
      deleted: false,
      user_id: 2
    },
    {
      id: 4,
      title: "Chaqueta de Cuero Original",
      shortDescription: "Chaqueta de cuero genuino talla M",
      imageUrl: "https://picsum.photos/200/300?fashion",
      category: { id: 4, name: "Fashion" },
      placeName: "Boutique Elegance",
      location: "Zona Comercial Golden",
      price: 299.99,
      deleted: true,  
      user_id: 3
    }
  ];


export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulamos una llamada a la API
    const fetchOffers = async () => {
      try {
        // En un caso real, aquí harías el fetch a tu API
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simular delay
        setOffers(mockOffers)
      } catch (error) {
        console.error("Error fetching offers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOffers()
  }, [])

  const filteredOffers =
    selectedCategory === "all" ? offers : offers.filter((offer) => offer.category.name === selectedCategory)

  const categories = ["all", "Spa", "Restaurantes", "Ocio"]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ofertas Especiales</h1>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
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
        </div>

        {filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron ofertas en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

