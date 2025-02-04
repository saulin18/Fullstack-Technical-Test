import { useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import useAuthStore from "../../stores/authStore";

const AuthLoader = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, setUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData); 
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
  }, [setUser]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return <>{children}</>;
};

export default AuthLoader;