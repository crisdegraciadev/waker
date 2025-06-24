import { AppRoutes } from "@/core/constants/app-routes";
import { useTopbarBreadcrumbStore } from "@/core/state/topbar-breadcrumb-store";
import { useEffect } from "react";

export function WorkoutDetailsPage() {
  const setSteps = useTopbarBreadcrumbStore((state) => state.setSteps);

  useEffect(() => {
    setSteps([
      { label: "Workouts", route: AppRoutes.WORKOUTS },
      { label: "Upper", route: "/1" },
    ]);
  });

  return <p>Workout details</p>;
}
