import { LoadingContent } from "@/core/components/custom/loading-content";
import { ServerError } from "@/core/components/custom/server-error";
import { MainLayout } from "@/core/components/layouts/main";
import { Button } from "@/core/components/ui/button";
import { Calendar } from "@/core/components/ui/calendar";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/card";
import { AppRoutes } from "@/core/constants/app-routes";
import { useFindWorkoutQuery } from "@/core/requests/workouts/queries/use-find-workout";
import { useTopbarBreadcrumbStore } from "@/core/state/topbar-breadcrumb-store";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ProgressionTable } from "./components/progression-table";
import { WorkoutDetailsToolbar } from "./components/toolbar";
import type { DateRange } from "react-day-picker";

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

  const [date, setDate] = useState<Date | undefined>(new Date(2025, 0, 1));

  return (
    <MainLayout>
      {!workout && isLoading && <LoadingContent />}
      {!isSuccess && <ServerError />}
      {isSuccess && (
        <>
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">{workout.name}</h2>
            <p className="text-muted-foreground">Manage your workout progression from this view.</p>
          </div>

          <div className="flex gap-4">
            <div>
              <Card className="gap-2">
                <CardHeader className="border-b !pb-3">
                  <CardTitle>Progressions</CardTitle>
                  <CardDescription>Find a progression</CardDescription>
                  <CardAction>
                    <div className="flex gap-2">
                      <Button variant="outline">Update</Button>
                      <Button>Create</Button>
                    </div>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    defaultMonth={date}
                    numberOfMonths={12}
                    selected={date}
                    onSelect={setDate}
                    className="w-max"
                    hideNavigation
                    classNames={{ months: "grid grid-cols-4 gap-2" }}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="w-full flex flex-col gap-4">
              <ProgressionTable />
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}
