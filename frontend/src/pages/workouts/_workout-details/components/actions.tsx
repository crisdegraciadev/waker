import { Button } from "@/core/components/ui/button";
import { ProgressionForm } from "./form";
import { useState } from "react";

export function ProgressionActions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Button className="font-medium text-xs h-8" variant="outline">Update</Button>
      <ProgressionForm isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
    </div>
  );
}
