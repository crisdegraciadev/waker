import { Badge } from "@/core/components/ui/badge";
import { WORKOUT_TYPES_LABELS, type WorkoutType } from "@/core/types/workouts/workout-type";
import type { Workout } from "@/core/types/workouts/workouts";
import type { ColumnDef } from "@tanstack/react-table";
import { WorkoutTableActions } from "../components/table-actions";

export const workoutTableColumns: ColumnDef<Workout>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = String(row.getValue("type")) as WorkoutType;
      return <Badge variant="outline">{WORKOUT_TYPES_LABELS[type]}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <WorkoutTableActions workout={row.original} />,
  },
];
