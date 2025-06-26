import { FacetedFilter } from "@/core/components/custom/faceted-filter";
import { Input } from "@/core/components/ui/input";
import { EXERCISE_DIFFICULTIES, EXERCISE_DIFFICULTIES_LABELS } from "@/core/types/exercises/exercise-difficulty.type";
import { EXERCISE_TYPES, EXERCISE_TYPES_LABELS } from "@/core/types/exercises/exercise-type.type";
import type { FilterExerciseDto } from "@/core/types/exercises/filter-exercise.dto";
import { useState, type Dispatch, type SetStateAction } from "react";
import { ExerciseForm } from "./form";

type Props = {
  filters: FilterExerciseDto;
  setFilters: Dispatch<SetStateAction<FilterExerciseDto>>;
};

export function ExercisesToolbar({ filters, setFilters }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex gap-2 justify-between">
      <div className="flex flex-wrap gap-2 w-full">
        <Input
          value={filters.name ?? ""}
          className="w-[300px] h-8"
          placeholder="Filter exercises..."
          onChange={(e) => setFilters((old) => ({ ...old, name: e.target.value }))}
        />
        <FacetedFilter
          title="Type"
          options={EXERCISE_TYPES}
          labels={EXERCISE_TYPES_LABELS}
          filters={filters.type}
          setFilters={(type) => setFilters((old) => ({ ...old, type }))}
        />
        <FacetedFilter
          title="Difficulty"
          options={EXERCISE_DIFFICULTIES}
          labels={EXERCISE_DIFFICULTIES_LABELS}
          filters={filters.difficulty}
          setFilters={(difficulty) => setFilters((old) => ({ ...old, difficulty }))}
        />
      </div>

      <div>
        <ExerciseForm isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
      </div>
    </div>
  );
}
