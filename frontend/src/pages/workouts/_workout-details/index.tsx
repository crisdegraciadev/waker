import { LoadingContent } from "@/core/components/custom/loading-content";
import { ServerError } from "@/core/components/custom/server-error";
import { MainLayout } from "@/core/components/layouts/main";
import { Button } from "@/core/components/ui/button";
import { Calendar } from "@/core/components/ui/calendar";
import { AppRoutes } from "@/core/constants/app-routes";
import { useFindWorkoutQuery } from "@/core/requests/workouts/queries/use-find-workout";
import { useTopbarBreadcrumbStore } from "@/core/state/topbar-breadcrumb-store";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ProgressionTable } from "./components/progression-table";
import { ProgressionForm } from "./components/form";
import { ProgressionActions } from "./components/actions";

export function WorkoutDetailsPage() {
  const setSteps = useTopbarBreadcrumbStore((state) => state.setSteps);

  useEffect(() => {
    setSteps([
      { label: "Workouts", route: AppRoutes.WORKOUTS },
      { label: "Upper", route: "/1" },
    ]);
  });

  const { id } = useParams();
  const workoutId = Number(id);

  const { data: workout, isLoading, isSuccess } = useFindWorkoutQuery(workoutId);

  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <MainLayout>
      {!workout && isLoading && <LoadingContent />}
      {!isSuccess && <ServerError />}
      {isSuccess && (
        <>
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{workout.name}</h2>
              <p className="text-muted-foreground">Manage your workout progression from this view.</p>
            </div>
            <ProgressionActions />
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-4">
              <Calendar
                mode="single"
                defaultMonth={date}
                numberOfMonths={1}
                selected={date}
                onSelect={setDate}
                className="w-full border rounded-lg"
              />
              <div className="w-full border rounded-lg p-3">
                <h2 className="text-sm font-semibold mb-2">Statistics</h2>
                <ul className="text-sm mb-4">
                  <li className="flex justify-between">
                    <span>Duration</span> <span className="text-muted-foreground">55 mins</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total Sets</span> <span className="text-muted-foreground">12</span>
                  </li>
                </ul>

                <Button className="w-full" variant="secondary">
                  Detailed Metrics
                </Button>
              </div>
            </div>

            <ProgressionTable />
          </div>
        </>
      )}
    </MainLayout>
  );
}
