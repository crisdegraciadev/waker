import { Input } from "@/core/components/ui/input";
import { EXERCISE_DIFFICULTIES, EXERICSE_DIFFICULTIES_LABELS } from "@/core/types/exercises/exercise-difficulty.type";
import { EXERCISE_TYPES, EXERICSE_TYPES_LABELS } from "@/core/types/exercises/exercise-type.type";
import { useState } from "react";
import { ExerciseForm } from "./exercise-form";
import { FacetedFilter } from "./faceted-filter";

export function ExercisesToolbar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Input className="min-w-[300px] h-8" placeholder="Filter exercises..." />
        <FacetedFilter title="Type" options={EXERCISE_TYPES} labels={EXERICSE_TYPES_LABELS} />
        <FacetedFilter title="Difficulty" options={EXERCISE_DIFFICULTIES} labels={EXERICSE_DIFFICULTIES_LABELS} />
      </div>

      <div>
        <ExerciseForm isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
      </div>
    </div>
  );
}
