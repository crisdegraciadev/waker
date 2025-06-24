import { AccountPage } from "@/pages/account";
import { DashboardPage } from "@/pages/dashboard";
import { ExercisesPage } from "@/pages/exercises";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { SettingsPage } from "@/pages/settings";
import { WorkoutsPage } from "@/pages/workouts";
import { WorkoutDetailsPage } from "@/pages/workouts/_workout-details";
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
          <Route path="/" element={<Navigate to={AppRoutes.DASHBOARD} />} />
          <Route path={AppRoutes.DASHBOARD} element={<DashboardPage />} />
          <Route path={AppRoutes.ACCOUNT} element={<AccountPage />} />
          <Route path={AppRoutes.WORKOUTS}>
            <Route index element={<WorkoutsPage />} />
            <Route path={":id"} element={<WorkoutDetailsPage />} />
          </Route>
          <Route path={AppRoutes.EXERCISES} element={<ExercisesPage />} />
          <Route path={AppRoutes.SETTINGS} element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
