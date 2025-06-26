import { Button } from "@/core/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/core/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { QueryKeys } from "@/core/constants/query-keys";
import { useCreateExerciseMutation } from "@/core/requests/exercises/mutations/use-create-exercise-mutation";
import { useUpdateExerciseMutation } from "@/core/requests/exercises/mutations/use-update-exercise-mutation";
import type { ErrorEntity } from "@/core/types/error/error.entity";
import type { Exercise } from "@/core/types/exercises/exercise";
import { EXERCISE_DIFFICULTIES, EXERCISE_DIFFICULTIES_LABELS } from "@/core/types/exercises/exercise-difficulty.type";
import { EXERCISE_TYPES, EXERCISE_TYPES_LABELS } from "@/core/types/exercises/exercise-type.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  type: z.enum(EXERCISE_TYPES),
  difficulty: z.enum(EXERCISE_DIFFICULTIES),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  exercise?: Exercise;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

function setDefaultValues(exercise?: Exercise) {
  return (
    exercise ?? {
      name: "",
      type: "WEIGHT",
      difficulty: "MEDIUM",
    }
  );
}

export function ExerciseForm({ exercise, isDialogOpen, setIsDialogOpen }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: setDefaultValues(exercise),
  });

  const queryClient = useQueryClient();

  const { mutate: createExercise } = useCreateExerciseMutation({
    onSuccess: () => handleSuccess("Exercise has been created."),
    onError: handleError,
  });

  const { mutate: updateExercise } = useUpdateExerciseMutation({
    onSuccess: () => handleSuccess("Exercise has been updated."),
    onError: handleError,
  });

  const isUpdateMode = !!exercise;

  function handleSuccess(sucessMessage: string) {
    toast.success(sucessMessage);
    setIsDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: QueryKeys.Exercises.FIND_ALL });
  }

  function handleError(e: ErrorEntity) {
    if (e.statusCode === 409) toast.error("Exercise with the same name already exists.");
    if (e.statusCode === 500) toast.error("Unknow error.");
  }

  function onSubmit(values: FormValues) {
    if (exercise) {
      updateExercise({ id: exercise.id, ...values });
    } else {
      createExercise(values);
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
          <DialogTitle>Create exercise</DialogTitle>
          <DialogDescription>Fill the following form to create an exercise on the system.</DialogDescription>
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
                    <Input placeholder="Weighted Pull Up" {...field} />
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
                        <SelectValue placeholder="Select an exercise type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXERCISE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {EXERCISE_TYPES_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an exercise difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXERCISE_DIFFICULTIES.map((d) => (
                        <SelectItem key={d} value={d}>
                          {EXERCISE_DIFFICULTIES_LABELS[d]}
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
