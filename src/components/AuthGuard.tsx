import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    // Redirigir al dashboard correspondiente según el rol
    const redirectPath = user.rol === 'Administrador' 
      ? '/admin'
      : user.rol === 'Encargado'
        ? '/staff'
        : '/client';
    
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;