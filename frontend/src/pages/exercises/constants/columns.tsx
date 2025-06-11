import { Badge } from "@/core/components/ui/badge";
import type { Exercise } from "@/core/types/exercises/exercise";
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
      const difficulty = String(row.getValue("difficulty"));
      const formattedStr = difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
      return <Badge variant="outline">{formattedStr}</Badge>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = String(row.getValue("type"));
      const formattedStr = type.charAt(0) + type.slice(1).toLowerCase().replace("_", " ");
      return <Badge variant="outline">{formattedStr}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ExerciseTableActions exercise={row.original} />,
  },
];
