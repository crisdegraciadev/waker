import { MainLayout } from "@/core/components/layouts/main";
import { ExercisesToolbar } from "./components/toolbar";

export function ExercisesPage() {
  return (
    <MainLayout>
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Exercise List</h2>
        <p className="text-muted-foreground">Manage your exercises from this view.</p>
      </div>
      <ExercisesToolbar />
    </MainLayout>
  );
}
