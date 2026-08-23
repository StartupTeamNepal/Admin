import { Navigate, Outlet, useLocation } from "react-router-dom";

export function ProtectedRoute() {
  const location = useLocation();

  // Replace this with your actual auth state (e.g., AuthContext, Redux, or Zustand)
  const isAuthenticated = Boolean(localStorage.getItem("isAuthenticated"));

  if (!isAuthenticated) {
    // Redirect to login, preserving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated -> render wrapped routes
  return <Outlet />;
}