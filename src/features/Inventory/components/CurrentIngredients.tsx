import React, { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/Datatable'; // Path to your DataTable component
import { Badge } from '@/components/ui/badge';

export interface IngredientQuantityRow {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  lastUpdated: string;
}

const INITIAL_DATA: IngredientQuantityRow[] = [
  {
    id: '1',
    name: 'Yellow Onion',
    quantity: 18.5,
    unit: 'kg',
    category: 'Produce',
    lastUpdated: '10 mins ago',
  },
  {
    id: '2',
    name: 'Russet Potato',
    quantity: 42.0,
    unit: 'kg',
    category: 'Produce',
    lastUpdated: '1 hour ago',
  },
  {
    id: '3',
    name: 'Garlic Cloves',
    quantity: 2.3,
    unit: 'kg',
    category: 'Produce',
    lastUpdated: '3 hours ago',
  },
  {
    id: '4',
    name: 'Roma Tomato',
    quantity: 12.0,
    unit: 'kg',
    category: 'Produce',
    lastUpdated: '25 mins ago',
  },
  {
    id: '5',
    name: 'Basmati Rice',
    quantity: 50.0,
    unit: 'kg',
    category: 'Dry Goods',
    lastUpdated: 'Yesterday',
  },
  {
    id: '6',
    name: 'Olive Oil',
    quantity: 15.0,
    unit: 'L',
    category: 'Pantry',
    lastUpdated: '2 days ago',
  },
  {
    id: '7',
    name: 'Whole Milk',
    quantity: 8.5,
    unit: 'L',
    category: 'Dairy',
    lastUpdated: '4 hours ago',
  },
];

export default function IngredientQuantityTable() {
  const [data] = useState<IngredientQuantityRow[]>(INITIAL_DATA);

  // Define Columns
  const columns: ColumnDef<IngredientQuantityRow>[] = [
    {
      accessorKey: 'name',
      header: 'Ingredient',
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Current Quantity',
      cell: ({ row }) => (
        <div className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
          {row.original.quantity}{' '}
          <span className="text-xs font-normal text-slate-500">
            {row.original.unit}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-slate-600 dark:text-slate-400">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: 'lastUpdated',
      header: 'Last Updated',
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {row.original.lastUpdated}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      {/* Header with Title and "View more" Link */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Inventory Stock Levels
          </h2>
          <p className="text-sm text-slate-500">
            Current stock quantities across all ingredient categories.
          </p>
        </div>

        {/* View More Link */}
        <button
          type="button"
          onClick={() => {}}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline cursor-pointer"
        >
          View more &rarr;
        </button>
      </div>

      {/* DataTable Configured for Max 5 Rows */}
      <DataTable
        columns={columns}
        data={data}
        enableFiltering={true}
        enablePagination={true}
        pageSize={5}
      />
    </div>
  );
}