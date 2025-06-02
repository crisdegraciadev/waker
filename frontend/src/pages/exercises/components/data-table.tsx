import { Button } from "@/core/components/ui/button";
import {
  Table as TanstackTable,
  TableBody as TanstackTableBody,
  TableCell as TanstackTableCell,
  TableHead as TanstackTableHead,
  TableHeader as TanstackTableHeader,
  TableRow as TanstackTableRow,
} from "@/core/components/ui/table";
import { useFindAllExercisesQuery } from "@/core/requests/queries/use-find-all-exercises-query";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { exerciseColumns } from "../constants/columns";
import { Skeleton } from "@/core/components/ui/skeleton";

export function ExerciseDataTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: exercisesPage, isLoading, isSuccess } = useFindAllExercisesQuery({ page: pagination.pageIndex, limit: pagination.pageSize });

  const table = useReactTable({
    data: exercisesPage?.data ?? [],
    columns: exerciseColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: exercisesPage?.pageable.totalEntities,
    pageCount: exercisesPage?.pageable.totalPages,
    onPaginationChange: setPagination,
    state: { pagination },
  });

  function TableHeaders() {
    return (
      <TanstackTableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TanstackTableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TanstackTableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TanstackTableHead>
              );
            })}
          </TanstackTableRow>
        ))}
      </TanstackTableHeader>
    );
  }

  function TableBody() {
    return (
      <TanstackTableBody>
        {[...Array(10).keys()].map(() => (
          <TanstackTableRow className="gap-8">
            <TanstackTableCell colSpan={exerciseColumns.length} className="h-4">
              <Skeleton className="h-4" />
            </TanstackTableCell>
          </TanstackTableRow>
        ))}
      </TanstackTableBody>
    );

    if (isLoading) {
      return (
        <TanstackTableBody>
          <TanstackTableRow>
            <TanstackTableCell colSpan={exerciseColumns.length} className="h-24 text-center">
              <Skeleton className="h-4 w-[250px]" />
            </TanstackTableCell>
          </TanstackTableRow>
        </TanstackTableBody>
      );
    }

    if (isSuccess && !table.getRowModel().rows?.length) {
      return (
        <TanstackTableBody>
          <TanstackTableRow>
            <TanstackTableCell colSpan={exerciseColumns.length} className="h-24 text-center">
              No results.
            </TanstackTableCell>
          </TanstackTableRow>
        </TanstackTableBody>
      );
    }

    return (
      <TanstackTableBody>
        {table.getRowModel().rows.map((row) => (
          <TanstackTableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TanstackTableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TanstackTableCell>
            ))}
          </TanstackTableRow>
        ))}
      </TanstackTableBody>
    );
  }

  function Pagination() {
    return (
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <TanstackTable>
          <TableHeaders />
          <TableBody />
        </TanstackTable>
      </div>

      <Pagination />
    </div>
  );
}
