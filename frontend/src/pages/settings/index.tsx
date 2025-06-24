import { MainLayout } from "@/core/components/layouts/main";
import { AppRoutes } from "@/core/constants/app-routes";
import { useTopbarBreadcrumbStore } from "@/core/state/topbar-breadcrumb-store";
import { useEffect } from "react";

export function SettingsPage() {
  const setSteps = useTopbarBreadcrumbStore((state) => state.setSteps);

  useEffect(() => {
    setSteps([{ label: "Settings", route: AppRoutes.SETTINGS }]);
  });

  return (
    <MainLayout>
      <p>Settings</p>
    </MainLayout>
  );
}
