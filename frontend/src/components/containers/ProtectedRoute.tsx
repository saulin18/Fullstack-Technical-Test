import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/auth";

export const ProtectedRoute = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles: string[];
}) => {


  const { data: user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    } else if (roles && !roles.includes(user.role)) {
      navigate("/");
    }
  }, [user, roles, navigate]);

  return user ? children : null;
};
