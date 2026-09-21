import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Ban, CheckCircle,Trash2 } from 'lucide-react';

export type TableStatus = 'unbooked' | 'booked' | 'unavailable';

export interface RestaurantTableProps {
  tableNumber?: number;
  capacity?: number;
  status?: TableStatus;
  initialStatus?: TableStatus;
  isSelected?: boolean;
  onSelect?: () => void;
  onStatusChange?: (newStatus: TableStatus) => void;
  onDelete?: () => void;

}

interface StatusStyle {
  label: string;
  bg: string;
  border: string;
  text: string;
  badge: string;
}

const STATUS_CONFIG: Record<TableStatus, StatusStyle> = {
  unbooked: {
    label: 'Unbooked',
    bg: 'bg-emerald-100 dark:bg-emerald-950/50',
    border: 'border-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-500',
  },
  booked: {
    label: 'Booked',
    bg: 'bg-rose-100 dark:bg-rose-950/50',
    border: 'border-rose-500',
    text: 'text-rose-700 dark:text-rose-300',
    badge: 'bg-rose-500',
  },
  unavailable: {
    label: 'Unavailable',
    bg: 'bg-amber-100 dark:bg-amber-950/50',
    border: 'border-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-500',
  },
};

export default function RestaurantTable({
  tableNumber = 1,
  capacity = 4,
  status: controlledStatus,
  initialStatus = 'unbooked',
  isSelected = false,
  onSelect,
  onStatusChange,
  onDelete,
}: RestaurantTableProps) {
  const [internalStatus, setInternalStatus] = useState<TableStatus>(
    controlledStatus ?? initialStatus
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (controlledStatus !== undefined) {
      setInternalStatus(controlledStatus);
    }
  }, [controlledStatus]);

  const currentStatus = controlledStatus ?? internalStatus;
  const currentConfig = STATUS_CONFIG[currentStatus];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusUpdate = (
    newStatus: TableStatus,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    setInternalStatus(newStatus);
    setIsMenuOpen(false);

    onStatusChange?.(newStatus);
  };

  return (
    <div
      onClick={onSelect}
      className={`relative flex flex-col justify-between w-48 h-36 p-4 rounded-xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-md
        ${currentConfig.bg}
        ${currentConfig.border}
        ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : ''}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg text-slate-800 dark:text-slate-100">
          Table {tableNumber}
        </span>

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Table options"
          >
            <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-10 py-1 text-sm">
              {currentStatus !== 'unavailable' ? (
                <button
                  type="button"
                  onClick={(e) =>
                    handleStatusUpdate('unavailable', e)
                  }
                  className="w-full text-left px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Make Unbookable
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) =>
                    handleStatusUpdate('unbooked', e)
                  }
                  className="w-full text-left px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Make Available
                </button>
                
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onDelete?.();
                }}
                className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Table
              </button>
            </div>
            
          )}
        </div>
      </div>

      {/* Capacity */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Seats: {capacity} people
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mt-auto">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white ${currentConfig.badge}`}
        >
          {currentConfig.label}
        </span>

        {isSelected && (
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Selected
          </span>
        )}
      </div>
    </div>
  );
}