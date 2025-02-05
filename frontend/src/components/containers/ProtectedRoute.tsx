import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/types';

export const ProtectedRoute = ({ children, roles }: { children: JSX.Element; roles: string[] }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = queryClient.getQueryData<User>(['user']);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    } else if (roles && !roles.includes(user.role)) {
      navigate('/');
    }
  }, [user, roles, navigate]);

  return user ? children : null;
};