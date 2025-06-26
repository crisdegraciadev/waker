import { Badge } from "@/core/components/ui/badge";
import { AppRoutes } from "@/core/constants/app-routes";
import { WORKOUT_TYPES_LABELS } from "@/core/types/workouts/workout-type";
import type { Workout } from "@/core/types/workouts/workouts";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import { WorkoutTableActions } from "../components/table-actions";

export const workoutTableColumns: ColumnDef<Workout>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <Link to={`${AppRoutes.WORKOUTS}/${row.original.id}`}>{row.original.name}</Link>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant="outline">{WORKOUT_TYPES_LABELS[row.original.type]}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => <WorkoutTableActions workout={row.original} />,
  },
];
