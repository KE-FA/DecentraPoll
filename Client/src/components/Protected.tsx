import { Navigate } from "react-router-dom";
import useUser from "../store/userStore";

interface ProtectedProps {
  children: React.ReactNode;
  requireRole?: string; // optional role restriction
}

function Protected({ children, requireRole }: ProtectedProps) {
  const { user } = useUser();

  // Not logged in → send to login (root "/")
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role → send to home (root "/")
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  // Allowed → render child route
  return <>{children}</>;
}

export default Protected;