import { Button } from "@/core/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/core/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { QueryKeys } from "@/core/constants/query-keys";
import { useCreateWorkoutMutation } from "@/core/requests/workouts/mutations/use-create-workout";
import { useUpdateWorkoutMutation } from "@/core/requests/workouts/mutations/use-update-workout";
import type { ErrorEntity } from "@/core/types/error/error.entity";
import { WORKOUT_TYPES, WORKOUT_TYPES_LABELS } from "@/core/types/workouts/workout-type";
import type { Workout } from "@/core/types/workouts/workouts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  type: z.enum(WORKOUT_TYPES),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  workout?: Workout;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

function setDefaultValues(workout?: Workout) {
  return (
    workout ?? {
      name: "",
      type: "WEIGHTS",
    }
  );
}

export function WorkoutForm({ workout, isDialogOpen, setIsDialogOpen }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: setDefaultValues(workout),
  });

  const queryClient = useQueryClient();

  const { mutate: createWorkout } = useCreateWorkoutMutation({
    onSuccess: () => handleSuccess("Workout has been created."),
    onError: handleError,
  });

  const { mutate: updateWorkout } = useUpdateWorkoutMutation({
    onSuccess: () => handleSuccess("Workout has been updated."),
    onError: handleError,
  });

  const isUpdateMode = !!workout;

  function handleSuccess(sucessMessage: string) {
    toast.success(sucessMessage);
    setIsDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: QueryKeys.Workouts.FIND_ALL });
  }

  function handleError(e: ErrorEntity) {
    if (e.statusCode === 500) toast.error("Unknow error.");
  }

  function onSubmit(values: FormValues) {
    if (workout) {
      updateWorkout({ id: workout.id, ...values });
    } else {
      createWorkout(values);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {!isUpdateMode && (
        <DialogTrigger asChild>
          <Button className="font-medium text-xs h-8">Create</Button>
        </DialogTrigger>
      )}

      <DialogContent className="gap-0">
        <DialogHeader className="mb-6">
          <DialogTitle>Create workout</DialogTitle>
          <DialogDescription>Fill the following form to create a workout on the system.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Upper 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a workout type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WORKOUT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {WORKOUT_TYPES_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6 flex justify-between gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
