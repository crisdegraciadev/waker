import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { useLocalStorage } from "@uidotdev/usehooks";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { AppRoutes } from "../constants/app-routes";
import { LocalStorageKeys } from "../constants/local-storage-keys";

function ProtectedRoute() {
  const [accessToken] = useLocalStorage<string>(LocalStorageKeys.ACCESS_TOKEN);

  return !accessToken ? <Navigate to={AppRoutes.LOGIN} replace /> : <Outlet />;
}

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
        <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path={AppRoutes.DASHBOARD} element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
