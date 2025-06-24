import { Button } from "@/core/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import {
  Table as TanstackTable,
  TableBody as TanstackTableBody,
  TableCell as TanstackTableCell,
  TableHead as TanstackTableHead,
  TableHeader as TanstackTableHeader,
  TableRow as TanstackTableRow,
} from "@/core/components/ui/table";
import type { Pageable } from "@/core/types/utils/page";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

type Props<T, R> = {
  data: T[];
  columns: ColumnDef<T, R>[];
  pageable: Pageable;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
};

export function DataTable<T, R>({ data, columns, pageable, pagination, setPagination }: Props<T, R>) {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: pageable.totalEntities,
    pageCount: pageable.totalPages,
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
                <TanstackTableHead key={header.id} style={{ width: header.column.columnDef.size }}>
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
    if (!table.getRowModel().rows?.length) {
      return (
        <TanstackTableBody>
          <TanstackTableRow>
            <TanstackTableCell colSpan={columns.length} className="h-24 text-center">
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
      <div className="flex items-center justify-end px-2 mt-4 ">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button variant="outline" size="icon" className="size-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="icon" className="size-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
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
