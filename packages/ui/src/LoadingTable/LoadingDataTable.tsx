"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
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
  Input,
  Button,
  Skeleton,
} from "@repo/ui";
import React, { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  isSearch?: boolean;
  search?: { accessorKey: string; header: string };
  SelectFilter?: React.ReactNode;
  isdateFilter?: boolean;
}

export function LoadingDataTable<TData, TValue>({
  columns,
  data = [],
  isSearch = false,
  search,
  SelectFilter,
  isdateFilter,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="ui-rounded-md ui-flex ui-flex-col ui-overflow-auto">
      <div className="ui-flex ui-items-center ui-gap-1 ui-mb-3">
        {/* {isdateFilter && (
          <Skeleton className="">
            <DateFilter />
          </Skeleton>
        )} */}

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
              className={`ui-max-w-sm ui-bg-white ui-border ui-border-input`}
            />
          </div>
        )}
        {SelectFilter}
      </div>

      <Table className="ui-border ui-rounded-md ui-shadow-2xl">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={`ui-text-muted-foreground`}
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
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {table.getAllColumns().map((column) => (
                <TableCell key={column.id}>
                  <Skeleton className="h-4 w-14 rounded-sm" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2 ui-p-4 gap-2 self-end">
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
