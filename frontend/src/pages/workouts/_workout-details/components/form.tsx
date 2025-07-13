import { Button } from "@/core/components/ui/button";
import { Calendar } from "@/core/components/ui/calendar";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/core/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/core/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/core/components/ui/popover";
import { cn } from "@/core/lib/utils";
import type { Progression } from "@/core/types/progressions/progression";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  createdAt: z.date().min(new Date()),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  progression?: Progression;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

function setDefaultValues(progression?: Progression) {
  return progression ?? { createdAt: new Date() };
}

export function ProgressionForm({ progression, isDialogOpen, setIsDialogOpen }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: setDefaultValues(progression),
  });

  // const queryClient = useQueryClient();

  // const { mutate: createWorkout } = useCreateWorkoutMutation({
  //   onSuccess: () => handleSuccess("Workout has been created."),
  //   onError: handleError,
  // });
  //
  // const { mutate: updateWorkout } = useUpdateWorkoutMutation({
  //   onSuccess: () => handleSuccess("Workout has been updated."),
  //   onError: handleError,
  // });

  const isUpdateMode = !!progression;

  // function handleSuccess(sucessMessage: string) {
  //   toast.success(sucessMessage);
  //   setIsDialogOpen(false);
  //   queryClient.invalidateQueries({ queryKey: QueryKeys.Workouts.FIND_ALL });
  // }
  //
  // function handleError(e: ErrorEntity) {
  //   if (e.statusCode === 500) toast.error("Unknow error.");
  // }
  //
  function onSubmit(values: FormValues) {
    console.log({ values });
  }

  // function onSubmit(values: FormValues) {
  // if (progression) {
  //   updateWorkout({ id: progression.id, ...values });
  // } else {
  //   createWorkout(values);
  // }
  // }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {!isUpdateMode && (
        <DialogTrigger asChild>
          <Button className="font-medium text-xs h-8">Create</Button>
        </DialogTrigger>
      )}

      <DialogContent className="gap-0">
        <DialogHeader className="mb-6">
          <DialogTitle>Create progression</DialogTitle>
          <DialogDescription>Fill the following form to create a progression on the system.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creation Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
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
