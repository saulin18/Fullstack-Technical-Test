export const DashboardHeader = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard de Ofertas
        </h1>
        <a className="text-gray-900" href="/">
          Ir al home
        </a>
      </div>
    </header>
  );
};
