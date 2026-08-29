import { BrowserRouter, Routes, Route, Navigate, type RouteObject } from "react-router-dom";

// Layouts & Guards
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedLayout } from "@/layouts/ProtectedLayout";
 import { ProtectedRoute } from "@/routes/ProtectedRoute";

// Auth Pages
import Login from "@/features/auth/pages/Login";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
 // Dashboard Pages
import Dashboard from "@/pages/Dashboard";
import { RestaurantTableRoutes } from "@/features/Table/route";
import { InventoryRoutes } from "@/features/Inventory/route";
import { StaffRoutes } from "@/features/Staff/routes";
import { BillingRoutes } from "@/features/Billing/route";
import { ReportRoutes } from "@/features/Reports/route";
import { NotificationRoutes } from "@/features/Notifications/route";
import { ProfileRoutes } from "@/features/Profile/route";
import { MenuRoutes } from "@/features/Menu/route";
const protectedRoutes :RouteObject[]=[

...RestaurantTableRoutes,
...InventoryRoutes,
...StaffRoutes,
...BillingRoutes,
...ReportRoutes,
...NotificationRoutes,
...ProfileRoutes,
...MenuRoutes
]

 

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

       
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            {/* Add additional dashboard sub-routes here */}
            {/* <Route path="/settings" element={<Settings />} /> */}
            {/* Dynamically render all feature route objects */}
              {protectedRoutes.map((route, index) => (
                <Route
                  key={route.path || index}
                  path={route.path}
                  element={route.element}
                />
              ))}
          </Route>
        </Route>

       
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}