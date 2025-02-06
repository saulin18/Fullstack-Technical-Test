import useAuthStore from "../../stores/authStore";
import Loader from "../Loader";
import { useAuth } from "../../hooks/auth";
import { useEffect } from "react";

const AuthLoader = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useAuthStore();
  const { data: user, isLoading: isLoadingUser } = useAuth();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (isLoadingUser) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthLoader;
