import { Link, useLocation } from "react-router";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { AppRoutes } from "@/core/constants/app-routes";
import React from "react";

const BREACRUMB_STEPS: Record<string, { label: string; route: string }> = {
  account: {
    label: "Account",
    route: AppRoutes.ACCOUNT,
  },
  settings: {
    label: "Settings",
    route: AppRoutes.SETTINGS,
  },
  dashboard: {
    label: "Dashboard",
    route: AppRoutes.DASHBOARD,
  },
  workouts: {
    label: "Workouts",
    route: AppRoutes.WORKOUTS,
  },
  exercises: {
    label: "Exercises",
    route: AppRoutes.EXERCISES,
  },
};

export function TopbarBreadcrumb() {
  const location = useLocation();

  const steps = location.pathname
    .split("/")
    .filter((s) => s)
    .map((s) => BREACRUMB_STEPS[s]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={steps[0].route}>{steps[0].label}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {steps.length > 1 &&
          steps.slice(1, steps.length).map((s, idx, lastSteps) => (
            <React.Fragment key={s.route}>
              <BreadcrumbSeparator />

              {idx === lastSteps.length - 1 ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{s.label}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={s.route}>{s.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
