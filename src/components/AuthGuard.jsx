
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const AuthGuard = ({ 
  children, 
  requireAdmin = false,
  requireModerator = false,
  requireWorker = false
}) => {
  const { state } = useAuth();
  const { isAuthenticated, user } = state;
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to access this page",
        variant: "destructive"
      });
    } else if (requireAdmin && !user?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges to access this page",
        variant: "destructive"
      });
    } else if (requireModerator && !user?.isModerator && !user?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have moderator privileges to access this page",
        variant: "destructive"
      });
    } else if (requireWorker && !user?.isWorker && !user?.isModerator && !user?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have worker privileges to access this page",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, requireAdmin, requireModerator, requireWorker, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireModerator && !user?.isModerator && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  if (requireWorker && !user?.isWorker && !user?.isModerator && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
