import { CalendarInput } from "@/core/components/custom/calendar-input";
import { Button } from "@/core/components/ui/button";

export function WorkoutDetailsToolbar() {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <CalendarInput placeholder="Progression date" />
      </div>

      <div className="flex gap-2">
        <Button variant="secondary">Edit</Button>
        <Button>Create</Button>
      </div>
    </div>
  );
}
