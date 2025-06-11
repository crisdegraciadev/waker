import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { CirclePlus } from "lucide-react";
import { ExerciseForm } from "./exercise-form";
import { useState } from "react";

export function ExercisesToolbar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Input className="min-w-[300px] h-8" placeholder="Filter exercises..." />
        <Button
          variant="outline"
          className="whitespace-nowrap font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-3 text-xs h-8 border-dashed"
        >
          <CirclePlus className="size-4 " /> Type
        </Button>
        <Button
          variant="outline"
          className="whitespace-nowrap font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-3 text-xs h-8 border-dashed"
        >
          <CirclePlus className="size-4" /> Difficulty
        </Button>
      </div>

      <div>
        <ExerciseForm isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
      </div>
    </div>
  );
}
