 import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  getAccessToken,
  isTokenExpired,
} from "@/shared/api/authStorage";

export function ProtectedRoute() {
  const location = useLocation();

  const token = getAccessToken();

  const isAuthenticated =
    !!token && !isTokenExpired();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}
 