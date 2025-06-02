import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/core/components/ui/dropdown-menu";
import type { Exercise } from "@/core/types/exercises/exercise";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";

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
    cell: () => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem disabled>Favourite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
