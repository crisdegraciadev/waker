import { Badge } from "@/core/components/ui/badge";
import type { Exercise } from "@/core/types/exercises/exercise";
import { EXERICSE_DIFFICULTIES_LABELS, type ExerciseDifficulty } from "@/core/types/exercises/exercise-difficulty.type";
import { EXERICSE_TYPES_LABELS, type ExerciseType } from "@/core/types/exercises/exercise-type.type";
import type { ColumnDef } from "@tanstack/react-table";
import { ExerciseTableActions } from "../components/table-actions";

export const exerciseColumns: ColumnDef<Exercise>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficulty = String(row.getValue("difficulty")) as ExerciseDifficulty;
      return <Badge variant="outline">{EXERICSE_DIFFICULTIES_LABELS[difficulty]}</Badge>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = String(row.getValue("type")) as ExerciseType;
      return <Badge variant="outline">{EXERICSE_TYPES_LABELS[type]}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ExerciseTableActions exercise={row.original} />,
  },
];
