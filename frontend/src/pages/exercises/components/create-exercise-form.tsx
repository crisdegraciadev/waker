import { Button } from "@/core/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/core/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { useCreateExerciseMutation } from "@/core/requests/mutations/use-create-exercise-mutation";
import { EXERCISE_DIFFICULTIES } from "@/core/types/exercises/exercise-difficulty.type";
import { EXERCISE_TYPES } from "@/core/types/exercises/exercise-type.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  type: z.enum(EXERCISE_TYPES),
  difficulty: z.enum(EXERCISE_DIFFICULTIES),
});

type FormValues = z.infer<typeof formSchema>;

const EXERCISE_TYPE_LABELS = {
  BODY_WEIGHT: "Body Weight",
  WEIGHT: "Weight",
  STRETCH: "Stretch",
  MOBILITY: "Mobility",
};

const EXERCISE_DIFFICULTIES_LABELS = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

export function CreateExerciseForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "WEIGHT",
      difficulty: "MEDIUM",
    },
  });

  const { mutate: createExercise } = useCreateExerciseMutation({
    onSuccess: () => {
      toast.success("Exercise has been created.");
    },
    onError: (e) => {
      if (e.statusCode === 409) toast.error("Exercise already exists.");
      if (e.statusCode === 500) toast.error("Unknow error.");
    },
  });

  function onSubmit(values: FormValues) {
    createExercise(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-medium text-xs h-8">Create</Button>
      </DialogTrigger>
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
                          {EXERCISE_TYPE_LABELS[t]}
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
