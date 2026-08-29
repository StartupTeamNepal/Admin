import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender, // <-- Added flexRender here
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enablePagination?: boolean;
  enableFiltering?: boolean;
  pageSize?: number;
  onRowSelect?: (selectedRows: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enablePagination = true,
  enableFiltering = true,
  pageSize = 5,
  onRowSelect,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: enableFiltering ? globalFilter : undefined,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const nextSelection =
        typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(nextSelection);

      if (onRowSelect) {
        const selectedIndices = Object.keys(nextSelection);
        const selectedData = selectedIndices.map((index) => data[Number(index)]);
        onRowSelect(selectedData.filter(Boolean));
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    ...(enableFiltering && { getFilteredRowModel: getFilteredRowModel() }),
    ...(enablePagination && { getPaginationRowModel: getPaginationRowModel() }),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Search Input Filter */}
      {enableFiltering && (
        <div className="flex items-center">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-xs"
          />
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={row.getToggleSelectedHandler()}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-slate-500"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {enablePagination && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="text-xs font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}