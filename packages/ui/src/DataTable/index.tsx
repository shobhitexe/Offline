"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Table";
import React, { useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isSearch?: boolean;
  search?: { accessorKey: string; header: string };
  SelectFilter?: React.ReactNode;
  varient?: "white" | "brown";
  DateFilter?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isSearch = false,
  search,
  SelectFilter,
  varient = "brown",
  DateFilter,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="ui-rounded-md ui-flex ui-flex-col ui-overflow-auto">
      <div className="ui-flex ui-items-center ui-gap-1 ui-mb-3">
        {DateFilter}
        {isSearch && (
          <div className="ui-flex ui-items-center ui-py-3 ui-px-2">
            <Input
              placeholder={search?.header}
              value={
                (table
                  .getColumn(search?.accessorKey || "")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn(search?.accessorKey || "")
                  ?.setFilterValue(event.target.value)
              }
              className={`ui-max-w-sm ${varient === "white" && "ui-bg-white ui-border ui-border-input"}`}
            />
          </div>
        )}
        {SelectFilter}
      </div>

      <Table className="ui-rounded-lg ui-shadow-2xl">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className={`${varient === "brown" && "ui-border-b ui-border-main ui-bg-main ui-rounded-2xl ui-text-main"} ui-rounded-md`}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={`${varient === "white" && "ui-text-muted-foreground"}`}
                    style={{
                      backgroundColor: `${varient === "white" && "white"}`,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`${varient === "brown" && "ui-border-none ui-text-main"}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className={`ui-h-24 ui-text-center ${varient === "white" ? "ui-bg-[#f4f7fa]" : "ui-text-main"}`}
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="ui-flex ui-items-center ui-justify-end ui-space-x-2 ui-p-4 ui-gap-2 ui-self-end">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>

        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
