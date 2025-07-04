import { MainLayout } from "@/core/components/layouts/main";
import { AppRoutes } from "@/core/constants/app-routes";
import { useTopbarBreadcrumbStore } from "@/core/state/topbar-breadcrumb-store";
import { useEffect } from "react";

export function DashboardPage() {
  const setSteps = useTopbarBreadcrumbStore((state) => state.setSteps);

  useEffect(() => {
    setSteps([{ label: "Dashboard", route: AppRoutes.DASHBOARD }]);
  });

  return (
    <MainLayout>
      <p>Dashboard</p>
    </MainLayout>
  );
}
