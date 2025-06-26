import { Badge } from "@/core/components/ui/badge";
import type { Exercise } from "@/core/types/exercises/exercise";
import { EXERCISE_DIFFICULTIES_LABELS } from "@/core/types/exercises/exercise-difficulty.type";
import { EXERCISE_TYPES_LABELS } from "@/core/types/exercises/exercise-type.type";
import type { ColumnDef } from "@tanstack/react-table";
import { ExerciseTableActions } from "../components/table-actions";

export const exerciseTableColumns: ColumnDef<Exercise>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 300,
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    size: 100,
    cell: ({ row }) => <Badge variant="outline">{EXERCISE_DIFFICULTIES_LABELS[row.original.difficulty]}</Badge>,
  },
  {
    accessorKey: "type",
    header: "Type",
    size: 100,
    cell: ({ row }) => <Badge variant="outline">{EXERCISE_TYPES_LABELS[row.original.type]}</Badge>,
  },
  {
    id: "actions",
    size: 1000,
    cell: ({ row }) => <ExerciseTableActions exercise={row.original} />,
  },
];
