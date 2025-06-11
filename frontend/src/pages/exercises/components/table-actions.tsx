import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/core/components/ui/alert-dialog";
import { Button } from "@/core/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/core/components/ui/dropdown-menu";
import { QueryKeys } from "@/core/constants/query-keys";
import { useDeleteExerciseMutation } from "@/core/requests/mutations/use-delete-exercise";
import { useQueryClient } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExerciseForm } from "./exercise-form";
import type { Exercise } from "@/core/types/exercises/exercise";

type Props = {
  exercise: Exercise;
};

export function ExerciseTableActions({ exercise }: Props) {
  const queryClient = useQueryClient();

  const { mutate: deleteExercise } = useDeleteExerciseMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.Exercises.FIND_ALL });
      toast.success("Exercise deleted");
    },
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  function ConfirmDeleteDialog() {
    return (
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your exercise and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteExercise(exercise.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <>
      <ConfirmDeleteDialog />
      <ExerciseForm exercise={exercise} isDialogOpen={isUpdateDialogOpen} setIsDialogOpen={setIsUpdateDialogOpen} />

      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>Edit</DropdownMenuItem>
            <DropdownMenuItem disabled>Favourite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
