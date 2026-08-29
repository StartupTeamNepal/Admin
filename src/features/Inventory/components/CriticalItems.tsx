import React, { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/Datatable'; // Path to your DataTable component
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, AlertTriangle, CheckCircle, Ban } from 'lucide-react';

export type StockStatus = 'critical' | 'low' | 'adequate' | 'out_of_stock';

export interface IngredientRow {
  id: string;
  name: string;
  category: string;
  currentStock: string;
  minimumRequired: string;
  status: StockStatus;
  supplier: string;
}

const INITIAL_INGREDIENTS: IngredientRow[] = [
  {
    id: 'ing-1',
    name: 'Yellow Onion',
    category: 'Produce',
    currentStock: '4.5 kg',
    minimumRequired: '15.0 kg',
    status: 'critical',
    supplier: 'Valley Produce Co.',
  },
  {
    id: 'ing-2',
    name: 'Russet Potato',
    category: 'Produce',
    currentStock: '8.0 kg',
    minimumRequired: '25.0 kg',
    status: 'critical',
    supplier: 'Valley Produce Co.',
  },
  {
    id: 'ing-3',
    name: 'Garlic Cloves',
    category: 'Produce',
    currentStock: '0.5 kg',
    minimumRequired: '3.0 kg',
    status: 'critical',
    supplier: 'Global Spice Importers',
  },
  {
    id: 'ing-4',
    name: 'Roma Tomato',
    category: 'Produce',
    currentStock: '0.0 kg',
    minimumRequired: '10.0 kg',
    status: 'out_of_stock',
    supplier: 'Fresh Harvest LLC',
  },
  {
    id: 'ing-5',
    name: 'Heavy Cream',
    category: 'Dairy',
    currentStock: '2.0 L',
    minimumRequired: '6.0 L',
    status: 'low',
    supplier: 'Alpine Dairy Supplies',
  },
  {
    id: 'ing-6',
    name: 'Unsalted Butter',
    category: 'Dairy',
    currentStock: '3.5 kg',
    minimumRequired: '10.0 kg',
    status: 'low',
    supplier: 'Alpine Dairy Supplies',
  },
  {
    id: 'ing-7',
    name: 'All-Purpose Flour',
    category: 'Dry Goods',
    currentStock: '22.0 kg',
    minimumRequired: '20.0 kg',
    status: 'adequate',
    supplier: 'Grain & Mill Distributors',
  },
];

export default function CriticalIngredientsTable() {
  const [ingredients, setIngredients] = useState<IngredientRow[]>(INITIAL_INGREDIENTS);

  // Status Badge Styling Helper
  const renderStatusBadge = (status: StockStatus) => {
    switch (status) {
      case 'critical':
        return (
          <Badge className="bg-amber-500 text-white hover:bg-amber-600 border-none gap-1">
            <AlertTriangle className="w-3 h-3" /> Critical Low
          </Badge>
        );
      case 'out_of_stock':
        return (
          <Badge className="bg-rose-500 text-white hover:bg-rose-600 border-none gap-1">
            <Ban className="w-3 h-3" /> Out of Stock
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-yellow-500 text-white hover:bg-yellow-600 border-none">
            Low Stock
          </Badge>
        );
      case 'adequate':
        return (
          <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-none gap-1">
            <CheckCircle className="w-3 h-3" /> Adequate
          </Badge>
        );
    }
  };

  const handleUpdateStatus = (id: string, newStatus: StockStatus) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  // Define Columns
  const columns: ColumnDef<IngredientRow>[] = [
    {
      accessorKey: 'name',
      header: 'Ingredient Name',
      cell: ({ row }) => (
        <div className="font-semibold text-slate-900 dark:text-slate-100">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: 'currentStock',
      header: 'Current Stock',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium text-slate-800 dark:text-slate-200">
          {row.original.currentStock}
        </span>
      ),
    },
    {
      accessorKey: 'minimumRequired',
      header: 'Min. Required',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-slate-500">
          {row.original.minimumRequired}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => renderStatusBadge(row.original.status),
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
      cell: ({ row }) => (
        <span className="text-slate-600 dark:text-slate-400 text-sm">
          {row.original.supplier}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()} // Prevent row selection trigger
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateStatus(item.id, 'adequate');
                }}
                className="text-emerald-600 cursor-pointer"
              >
                Mark as Restocked
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateStatus(item.id, 'critical');
                }}
                className="text-amber-600 cursor-pointer"
              >
                Flag as Critical
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Critical Ingredients Stock
        </h2>
        <p className="text-sm text-slate-500">
          Kitchen inventory running below required minimum thresholds.
        </p>
      </div>

      {/* Reusable DataTable Component */}
      <DataTable
        columns={columns}
        data={ingredients}
        enableFiltering={true}
        enablePagination={true}
        pageSize={5} // Max 5 rows per page
        onRowSelect={(selectedRows) => {
          console.log('Selected Ingredients for Purchase Order:', selectedRows);
        }}
      />
    </div>
  );
}