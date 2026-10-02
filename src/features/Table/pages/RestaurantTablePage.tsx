import React, { useState } from 'react';
import RestaurantTable from '../components/RestaurantTable';
import type { TableStatus } from '../components/RestaurantTable';
import AddTableButton from '../components/AddtableButton';
import TableForm from '../components/AddtableForm';
import type { TableFormData } from '../components/AddtableForm';

interface TableData {
  id: number;
  tableNumber: number;
  capacity: number;
  tableType: string;
  description: string;
  status: TableStatus;
}

export default function TableGrid() {
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [tables, setTables] = useState<TableData[]>([
    { id: 1, tableNumber: 1, capacity: 2, tableType: 'Indoor', description: 'Small table', status: 'unbooked' },
    { id: 2, tableNumber: 2, capacity: 4, tableType: 'Indoor', description: 'Standard table', status: 'booked' },
    { id: 3, tableNumber: 3, capacity: 6, tableType: 'Outdoor', description: 'Large outdoor table', status: 'unavailable' },
  ]);

  const handleAddTable = (data: TableFormData) => {
    const nextTableNumber =
      tables.length > 0 ? Math.max(...tables.map((t) => t.tableNumber)) + 1 : 1;

    const newTable: TableData = {
      id: Date.now(),
      tableNumber: Number(data.tableNumber) || nextTableNumber,
      capacity: data.capacity,
      tableType: data.tableType,
      description: data.description,
      status: 'unbooked',
    };

    setTables((prev) => [...prev, newTable]);
    setIsFormOpen(false);
  };

  const handleTableStatusChange = (tableId: number, newStatus: TableStatus) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId ? { ...table, status: newStatus } : table
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

        <AddTableButton onAdd={() => setIsFormOpen(true)} />
      </div>

      {/* Table Grid: always visible, even while the form is open */}
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

      {/* Modal overlay */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <TableForm
              onSubmit={handleAddTable}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}