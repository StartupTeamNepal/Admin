 import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface TableFormData {
  tableNumber: string;
  capacity: number;
  tableType: string;
  description: string;
}

interface TableFormProps {
  onSubmit: (data: TableFormData) => void;
  onCancel: () => void;
  initialData?: TableFormData;
  isEditing?: boolean;
}

export default function TableForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: TableFormProps) {
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [tableType, setTableType] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setTableNumber(initialData.tableNumber);
      setCapacity(String(initialData.capacity));
      setTableType(initialData.tableType);
      setDescription(initialData.description);
    } else {
      setTableNumber("");
      setCapacity("");
      setTableType("");
      setDescription("");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      tableNumber,
      capacity: Number(capacity),
      tableType,
      description,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {isEditing ? "Edit Table" : "Add Table"}
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isEditing
              ? "Update the table details."
              : "Enter the details for the restaurant table."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Table Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Table Number
            </label>

            <Input
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. 1"
              required
            />
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Capacity
            </label>

            <Input
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 4"
              required
            />
          </div>

          {/* Table Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Table Type
            </label>

            <select
              value={tableType}
              onChange={(e) => setTableType(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="" disabled>
                Select table type
              </option>

              <option value="table">Table</option>
              <option value="cabin">Cabin</option>
              <option value="room">Room</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the table..."
              rows={3}
              className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 dark:border-slate-700"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button type="submit">
              {isEditing ? "Save Changes" : "Add Table"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
 