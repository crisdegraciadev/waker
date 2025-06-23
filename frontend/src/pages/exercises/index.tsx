import { MainLayout } from "@/core/components/layouts/main";
import { useFindAllExercisesQuery } from "@/core/requests/queries/use-find-all-exercises-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { ExerciseDataTable } from "./components/data-table";
import { ExercisesToolbar } from "./components/toolbar";
import type { FilterExerciseDto } from "@/core/types/exercises/filter-exercise.dto";

function LoadingContent() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <LoaderCircle className="animate-spin w-16 h-16" />
    </div>
  );
}

function ServerError() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <p>Cannot connect to server.</p>
    </div>
  );
}

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
      {!exercisesPage && !isLoading && <LoadingContent />}
      {!isSuccess && <ServerError />}
      {isSuccess && (
        <ExerciseDataTable
          data={exercisesPage?.data ?? []}
          pageable={exercisesPage?.pageable}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </MainLayout>
  );
}
