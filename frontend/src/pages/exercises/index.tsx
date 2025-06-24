import { DataTable } from "@/core/components/custom/data-table";
import { LoadingContent } from "@/core/components/custom/loading-content";
import { ServerError } from "@/core/components/custom/server-error";
import { MainLayout } from "@/core/components/layouts/main";
import { useFindAllExercisesQuery } from "@/core/requests/exercises/queries/use-find-all-exercises-query";
import type { FilterExerciseDto } from "@/core/types/exercises/filter-exercise.dto";
import { useState } from "react";
import { ExercisesToolbar } from "./components/toolbar";
import { exerciseTableColumns } from "./constants/table-columns";

export function ExercisesPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<FilterExerciseDto>({
    name: null,
    difficulty: [],
    type: [],
  });

  const { data: exercisesPage, isLoading, isSuccess } = useFindAllExercisesQuery({ page: pagination.pageIndex, limit: pagination.pageSize }, filters);

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Exercise List</h2>
        <p className="text-muted-foreground">Manage your exercises from this view.</p>
      </div>
      <ExercisesToolbar filters={filters} setFilters={setFilters} />
      {!exercisesPage && isLoading && <LoadingContent />}
      {!isSuccess && <ServerError />}
      {isSuccess && (
        <DataTable
          data={exercisesPage?.data ?? []}
          columns={exerciseTableColumns}
          pageable={exercisesPage?.pageable}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </MainLayout>
  );
}
