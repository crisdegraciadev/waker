import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/core/components/ui/alert-dialog";
import { QueryKeys } from "@/core/constants/query-keys";
import { useDeleteWorkoutMutation } from "@/core/requests/workouts/mutations/use-delete-workout";
import type { Workout } from "@/core/types/workouts/workouts";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { WorkoutForm } from "./form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/core/components/ui/dropdown-menu";
import { Button } from "@/core/components/ui/button";
import { MoreVertical } from "lucide-react";

type Props = {
  workout: Workout;
};

export function WorkoutTableActions({ workout }: Props) {
  const queryClient = useQueryClient();

  const { mutate: deleteWorkout } = useDeleteWorkoutMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.Workouts.FIND_ALL });
      toast.success("Workout deleted");
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
              This action cannot be undone. This will permanently delete your workout and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteWorkout(workout.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <>
      <ConfirmDeleteDialog />
      <WorkoutForm workout={workout} isDialogOpen={isUpdateDialogOpen} setIsDialogOpen={setIsUpdateDialogOpen} />

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
