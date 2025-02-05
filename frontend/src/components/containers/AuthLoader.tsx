import { useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import useAuthStore from "../../stores/authStore";
import Loader from "../Loader";

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
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthLoader;