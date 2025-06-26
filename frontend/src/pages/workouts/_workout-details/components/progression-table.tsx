import { Badge } from "@/core/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components/ui/table";
import { EXERCISE_TYPES, EXERCISE_TYPES_LABELS, type ExerciseType } from "@/core/types/exercises/exercise-type.type";
import { TrendingUp } from "lucide-react";

const invoices = [
  {
    name: "Push Up",
    sets: 3,
    reps: 15,
    type: "BODY_WEIGHT",
    improvement: "Decrease",
  },
  {
    name: "Weighted Pull Ups",
    sets: 3,
    reps: 15,
    weight: 30,
    type: "WEIGHT",
    improvement: "Decrease",
  },
  {
    name: "Squats",
    sets: 3,
    reps: 15,
    weight: 40,
    type: "WEIGHT",
    improvement: "Increase",
  },
  {
    name: "Squats",
    sets: 3,
    reps: 15,
    weight: 40,
    type: "WEIGHT",
    improvement: "Maintain",
  },
];

export function ProgressionTable() {
  return (
    <div className="border rounded-lg h-fit w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px] bg-gray-100 rounded-tl-lg">Exercise</TableHead>
            <TableHead className="bg-gray-100">Sets</TableHead>
            <TableHead className="bg-gray-100">Reps</TableHead>
            <TableHead className="bg-gray-100">Weight (Kg)</TableHead>
            <TableHead className="bg-gray-100">Type</TableHead>
            <TableHead className="bg-gray-100 rounded-tr-lg">Improvement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((activity, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{activity.name}</TableCell>
              <TableCell>{activity.sets}</TableCell>
              <TableCell>{activity.reps}</TableCell>
              <TableCell>{activity.weight ?? "-"}</TableCell>
              <TableCell>
                <Badge>{EXERCISE_TYPES_LABELS[activity.type as ExerciseType]}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  <TrendingUp className="mr-1" /> {activity.improvement}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
