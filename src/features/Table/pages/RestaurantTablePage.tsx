import React, { useEffect, useState } from "react";
import RestaurantTable from "../components/RestaurantTable";
import type { TableStatus } from "../components/RestaurantTable";
import AddTableButton from "../components/AddtableButton";
import TableForm from "../components/AddtableForm";
import type { TableFormData } from "../components/AddtableForm";
import {
  getTables,
  createTable,
  updateTable,
} from "../api/links";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { getTableById } from "../api/links";
interface TableData {
  id: number;
  tableNumber: number;
  capacity: number;
  tableType: string;
  description: string;
  status: TableStatus;
}

export default function TableGrid() {
  const [selectedTableId, setSelectedTableId] = useState<number | null>(
    null
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [tables, setTables] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTable, setEditingTable] =
  useState<TableFormData | null>(null);
  // Get tables
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setIsLoading(true);

        const response = await getTables();

        if (response.success) {
          const formattedTables: TableData[] =
            response.data.items.map((table) => ({
              id: table.id,
              tableNumber: Number(table.tableNumber),
              capacity: table.capacity,
              tableType: table.tableType,
              description: table.description,
              status: table.status as TableStatus,
            }));

          setTables(formattedTables);
        } else {
          toast.error(
            response.message || "Failed to load tables"
          );
        }
      } catch (error: any) {
        console.error("Get tables error:", error);

        toast.error(
          error?.response?.data?.message ||
            "Failed to load tables. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, []);

  // Add table
  const handleAddTable = async (data: TableFormData) => {
    try {
      const response = await createTable({
        tableNumber: data.tableNumber,
        capacity: data.capacity,
        tableType: data.tableType,
        description: data.description,
      });

      if (!response.success) {
        toast.error(
          response.message || "Failed to create table"
        );
        return;
      }

      const newTable: TableData = {
        id: response.data.id,
        tableNumber: Number(response.data.tableNumber),
        capacity: response.data.capacity,
        tableType: response.data.tableType,
        description: response.data.description,
        status: response.data.status as TableStatus,
      };

      setTables((prev) => [...prev, newTable]);

      setIsFormOpen(false);

      toast.success(
        response.message || "Table created successfully"
      );
    } catch (error: any) {
      console.error("Create table error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to create table. Please try again."
      );
    }
  };

  // Edit table
  const handleEditTable = async (data: TableFormData) => {
    if (selectedTableId === null) {
      toast.error("Please select a table first.");
      return;
    }

    try {
      const response = await updateTable(selectedTableId, {
        tableNumber: data.tableNumber,
        capacity: data.capacity,
        tableType: data.tableType,
        description: data.description,
      });

      if (!response.success) {
        toast.error(
          response.message || "Failed to update table"
        );
        return;
      }

      setTables((prev) =>
        prev.map((table) =>
          table.id === selectedTableId
            ? {
                ...table,
                tableNumber: Number(
                  response.data.tableNumber
                ),
                capacity: response.data.capacity,
                tableType: response.data.tableType,
                description: response.data.description,
                status:
                  response.data.status as TableStatus,
              }
            : table
        )
      );

      setIsFormOpen(false);
      setIsEditing(false);

      toast.success(
        response.message || "Table updated successfully"
      );
    } catch (error: any) {
      console.error("Update table error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update table. Please try again."
      );
    }
  };

const handleOpenEdit = async () => {
  if (selectedTableId === null) {
    toast.error("Please select a table first.");
    return;
  }

  try {
    const response = await getTableById(selectedTableId);

    if (!response.success) {
      toast.error(
        response.message || "Failed to load table details."
      );
      return;
    }

    setEditingTable({
      tableNumber: response.data.tableNumber,
      capacity: response.data.capacity,
      tableType: response.data.tableType,
      description: response.data.description,
    });

    setIsEditing(true);
    setIsFormOpen(true);
  } catch (error: any) {
    console.error("Get table details error:", error);

    toast.error(
      error?.response?.data?.message ||
        "Failed to load table details. Please try again."
    );
  }
};

  const handleTableStatusChange = (
    tableId: number,
    newStatus: TableStatus
  ) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              status: newStatus,
            }
          : table
      )
    );
  };

  const selectedTable = tables.find(
    (table) => table.id === selectedTableId
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Restaurant Tables
        </h1>

        <div className="flex items-center gap-2">
          {selectedTable && (
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenEdit}
            >
              <Pencil className="mr-2 size-4" />
              Edit Table
            </Button>
          )}

          <AddTableButton
            onAdd={() => {
              setIsEditing(false);
              setIsFormOpen(true);
            }}
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-10 text-center text-slate-500">
          Loading tables...
        </div>
      )}

      {/* Empty */}
      {!isLoading && tables.length === 0 && (
        <div className="py-10 text-center text-slate-500">
          No tables found.
        </div>
      )}

      {/* Tables */}
      {!isLoading && tables.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {tables.map((table) => (
            <RestaurantTable
              key={table.id}
              tableNumber={table.tableNumber}
              capacity={table.capacity}
              status={table.status}
              isSelected={
                selectedTableId === table.id
              }
              onSelect={() =>
                setSelectedTableId(table.id)
              }
              onStatusChange={(newStatus) =>
                handleTableStatusChange(
                  table.id,
                  newStatus
                )
              }
            />
          ))}
        </div>
      )}

      {/* Add / Edit Form */}
      {isFormOpen && (
        <TableForm
        initialData={isEditing ? editingTable ?? undefined : undefined}
          isEditing={isEditing}
          onSubmit={
            isEditing
              ? handleEditTable
              : handleAddTable
          }
          onCancel={() => {
            setIsFormOpen(false);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}
 