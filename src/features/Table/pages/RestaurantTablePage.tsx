import React, { useState } from 'react';
import RestaurantTable, {

} from '../components/RestaurantTable';
import type { TableStatus } from '../components/RestaurantTable';import AddTableButton from '../components/AddtableButton';

interface TableData {
  id: number;
  tableNumber: number;
  capacity: number;
  status: TableStatus;
}

export default function TableGrid() {
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  const [tables, setTables] = useState<TableData[]>([
    {
      id: 1,
      tableNumber: 1,
      capacity: 2,
      status: 'unbooked',
    },
    {
      id: 2,
      tableNumber: 2,
      capacity: 4,
      status: 'booked',
    },
    {
      id: 3,
      tableNumber: 3,
      capacity: 6,
      status: 'unavailable',
    },
  ]);

  const handleAddTable = () => {
    setTables((prevTables) => {
      const nextTableNumber =
        prevTables.length > 0
          ? Math.max(
              ...prevTables.map((table) => table.tableNumber)
            ) + 1
          : 1;

      return [
        ...prevTables,
        {
          id: Date.now(),
          tableNumber: nextTableNumber,
          capacity: 4,
          status: 'unbooked',
        },
      ];
    });
  };

  const handleTableStatusChange = (
    tableId: number,
    newStatus: TableStatus
  ) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              status: newStatus,
            }
          : table
      )
    );
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Restaurant Tables
        </h1>

        <AddTableButton onAdd={handleAddTable} />
      </div>

      {/* Table Grid */}
      <div className="flex flex-wrap gap-4">
        {tables.map((table) => (
          <RestaurantTable
            key={table.id}
            tableNumber={table.tableNumber}
            capacity={table.capacity}
            status={table.status}
            isSelected={selectedTableId === table.id}
            onSelect={() => setSelectedTableId(table.id)}
            onStatusChange={(newStatus) =>
              handleTableStatusChange(table.id, newStatus)
            }
          />
        ))}
      </div>
    </div>
  );
}