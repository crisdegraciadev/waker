import { useTopbarBreadcrumbStore } from "@/core/state/topbar-breadcrumb-store";
import React from "react";
import { Link } from "react-router";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";

export function TopbarBreadcrumb() {
  const steps = useTopbarBreadcrumbStore((state) => state.steps);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={steps[0]?.route}>{steps[0]?.label}</Link>
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
