import useAuthStore from "../stores/authStore";

const AdminDashboardButton = () => {
  const { user } = useAuthStore();

  if (!user || user.role !== "admin") return null;


  return (
    <a href="/dashboard" className="bg-red-500 text-white p-2 rounded">
      Panel de Administración
    </a>
  );
};

export default AdminDashboardButton;
