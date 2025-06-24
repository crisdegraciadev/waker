import { LoadingContent } from "@/core/components/custom/loading-content";
import { ServerError } from "@/core/components/custom/server-error";
import { MainLayout } from "@/core/components/layouts/main";
import { useFindAllWorkoutsQuery } from "@/core/requests/workouts/queries/use-find-all-workouts";
import type { FilterWorkoutDto } from "@/core/types/workouts/filter-workout";
import { useEffect, useState } from "react";
import { WorkoutsToolbar } from "./components/toolbar";
import { DataTable } from "@/core/components/custom/data-table";
import { workoutTableColumns } from "./constants/table-columns";
import { useTopbarBreadcrumbStore } from "@/core/state/topbar-breadcrumb-store";
import { AppRoutes } from "@/core/constants/app-routes";

export function WorkoutsPage() {
  const setSteps = useTopbarBreadcrumbStore((state) => state.setSteps);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<FilterWorkoutDto>({
    name: null,
    type: [],
  });

  useEffect(() => {
    setSteps([{ label: "Workouts", route: AppRoutes.WORKOUTS }]);
  });

  const { data: workoutsPage, isLoading, isSuccess } = useFindAllWorkoutsQuery({ page: pagination.pageIndex, limit: pagination.pageSize }, filters);

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Workout List</h2>
        <p className="text-muted-foreground">Manage your workouts from this view.</p>
      </div>
      <WorkoutsToolbar filters={filters} setFilters={setFilters} />
      {!workoutsPage && isLoading && <LoadingContent />}
      {!isSuccess && <ServerError />}
      {isSuccess && (
        <DataTable
          data={workoutsPage?.data ?? []}
          columns={workoutTableColumns}
          pageable={workoutsPage?.pageable}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </MainLayout>
  );
}
