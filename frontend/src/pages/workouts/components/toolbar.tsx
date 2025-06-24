import { FacetedFilter } from "@/core/components/custom/faceted-filter";
import { Input } from "@/core/components/ui/input";
import type { FilterWorkoutDto } from "@/core/types/workouts/filter-workout";
import { WORKOUT_TYPES, WORKOUT_TYPES_LABELS } from "@/core/types/workouts/workout-type";
import { useState, type Dispatch, type SetStateAction } from "react";
import { WorkoutForm } from "./form";

type Props = {
  filters: FilterWorkoutDto;
  setFilters: Dispatch<SetStateAction<FilterWorkoutDto>>;
};

export function WorkoutsToolbar({ filters, setFilters }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Input
          value={filters.name ?? ""}
          className="min-w-[300px] h-8"
          placeholder="Filter workouts..."
          onChange={(e) => setFilters((old) => ({ ...old, name: e.target.value }))}
        />
        <FacetedFilter
          title="Type"
          options={WORKOUT_TYPES}
          labels={WORKOUT_TYPES_LABELS}
          filters={filters.type}
          setFilters={(type) => setFilters((old) => ({ ...old, type }))}
        />
      </div>

      <div>
        <WorkoutForm isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
      </div>
    </div>
  );
}
