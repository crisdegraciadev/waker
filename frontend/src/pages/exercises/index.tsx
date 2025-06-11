import { MainLayout } from "@/core/components/layouts/main";
import { useFindAllExercisesQuery } from "@/core/requests/queries/use-find-all-exercises-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { ExerciseDataTable } from "./components/data-table";
import { ExercisesToolbar } from "./components/toolbar";
import type { FilterExerciseDto } from "@/core/types/exercises/filter-exercise.dto";

export function ExercisesPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<FilterExerciseDto>({
    difficulty: [],
    type: [],
  });

  console.log({ filters });

  const { data: exercisesPage, isLoading, isSuccess } = useFindAllExercisesQuery({ page: pagination.pageIndex, limit: pagination.pageSize }, filters);

  if (!exercisesPage && isLoading) {
    return (
      <MainLayout>
        <div className="w-full h-full flex items-center justify-center">
          <LoaderCircle className="animate-spin w-16 h-16" />
        </div>
      </MainLayout>
    );
  }

  if (!isSuccess) {
    return (
      <MainLayout>
        <div className="w-full h-full flex items-center justify-center">
          <p>Cannot connect to server.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Exercise List</h2>
        <p className="text-muted-foreground">Manage your exercises from this view.</p>
      </div>
      <ExercisesToolbar filters={filters} setFilters={setFilters} />
      <ExerciseDataTable data={exercisesPage?.data ?? []} pageable={exercisesPage?.pageable} pagination={pagination} setPagination={setPagination} />
    </MainLayout>
  );
}
