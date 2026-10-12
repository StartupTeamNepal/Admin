import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Ban, CheckCircle, Trash2 } from 'lucide-react';
import TableOrdersDialog from '../components/OrderandBill';

export type TableStatus = 'unbooked' | 'booked' | 'unavailable';

export interface RestaurantTableProps {
  tableId: string;
  tableNumber?: number;
  capacity?: number;
  status?: TableStatus;
  initialStatus?: TableStatus;
  isSelected?: boolean;
  onSelect?: () => void;
  onStatusChange?: (newStatus: TableStatus) => void;
  onDelete?: () => void;
  /** Optional hook, called when the orders dialog is opened */
  onViewOrders?: (tableId: string) => void;
}

interface StatusTone {
  label: string;
  top: string; // table surface
  edge: string; // table thickness / shadow edge
  chair: string; // chair fill
  chairEdge: string; // chair thickness
  dot: string; // status dot (tailwind class)
  text: string; // status label (tailwind classes)
  stripes?: boolean;
}

const STATUS_CONFIG: Record<TableStatus, StatusTone> = {
  unbooked: {
    label: 'Unbooked',
    top: '#34d399',
    edge: '#047857',
    chair: '#a7f3d0',
    chairEdge: '#10b981',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  booked: {
    label: 'Booked',
    top: '#fb7185',
    edge: '#be123c',
    chair: '#fecdd3',
    chairEdge: '#f43f5e',
    dot: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-300',
  },
  unavailable: {
    label: 'Unavailable',
    top: '#fbbf24',
    edge: '#b45309',
    chair: '#fde68a',
    chairEdge: '#f59e0b',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
    stripes: true,
  },
};

const MAX_VISIBLE_CHAIRS = 12;

/* ------------------------------------------------------------------ */
/*  CSS-drawn table + chairs                                          */
/* ------------------------------------------------------------------ */

const sheen =
  'linear-gradient(145deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 55%)';
const stripes =
  'repeating-linear-gradient(45deg, rgba(0,0,0,0.13) 0 4px, rgba(0,0,0,0) 4px 9px)';

function Chair({
  tone,
  vertical = false,
}: {
  tone: StatusTone;
  vertical?: boolean;
}) {
  return (
    <span
      className="block rounded-[5px]"
      style={{
        width: vertical ? 11 : 20,
        height: vertical ? 20 : 11,
        backgroundColor: tone.chair,
        boxShadow: `0 2px 0 ${tone.chairEdge}`,
        transition: 'background-color 300ms, box-shadow 300ms',
      }}
    />
  );
}

function tableSurface(tone: StatusTone): React.CSSProperties {
  return {
    backgroundColor: tone.top,
    backgroundImage: tone.stripes ? `${stripes}, ${sheen}` : sheen,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.55), 0 5px 0 ${tone.edge}, 0 12px 14px -6px rgba(15,23,42,0.35)`,
    transition: 'background-color 300ms, box-shadow 300ms',
  };
}

function TableIllustration({
  capacity,
  tone,
}: {
  capacity: number;
  tone: StatusTone;
}) {
  const seats = Math.max(1, Math.min(capacity, MAX_VISIBLE_CHAIRS));

  /* Small tables: round top with chairs on a circle */
  if (seats <= 4) {
    const radius = 42;
    return (
      <div className="relative" style={{ width: 112, height: 112 }}>
        {Array.from({ length: seats }).map((_, i) => {
          const angle = (360 / seats) * i + (seats === 2 ? 90 : 0);
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
              }}
            >
              <Chair tone={tone} />
            </div>
          );
        })}
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: 58,
            height: 58,
            transform: 'translate(-50%, -50%)',
            ...tableSurface(tone),
          }}
        >
          <span className="absolute inset-1.75 rounded-full border border-white/40" />
        </div>
      </div>
    );
  }

  /* Larger tables: rounded rectangle with chairs along the sides */
  const ends = seats >= 6 ? 2 : 0;
  const rest = seats - ends;
  const top = Math.ceil(rest / 2);
  const bottom = rest - top;

  return (
    <div className="relative flex flex-col items-center" style={{ width: 132 }}>
      <div className="flex w-26 justify-around">
        {Array.from({ length: top }).map((_, i) => (
          <Chair key={i} tone={tone} />
        ))}
      </div>

      <div
        className="relative my-1.5 rounded-2xl"
        style={{ width: 104, height: 46, ...tableSurface(tone) }}
      >
        <span className="absolute inset-1.5 rounded-xl border border-white/40" />
        {ends === 2 && (
          <>
            <span className="absolute -left-3.75 top-1/2 -translate-y-1/2">
              <Chair tone={tone} vertical />
            </span>
            <span className="absolute -right-3.75 top-1/2 -translate-y-1/2">
              <Chair tone={tone} vertical />
            </span>
          </>
        )}
      </div>

      <div className="flex w-26 justify-around">
        {Array.from({ length: bottom }).map((_, i) => (
          <Chair key={i} tone={tone} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card                                                              */
/* ------------------------------------------------------------------ */

export default function RestaurantTable({
  tableId,
  tableNumber = 1,
  capacity = 4,
  status: controlledStatus,
  initialStatus = 'unbooked',
  isSelected = false,
  onSelect,
  onStatusChange,
  onDelete,
  onViewOrders,
}: RestaurantTableProps) {
  const [internalStatus, setInternalStatus] = useState<TableStatus>(
    controlledStatus ?? initialStatus
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  useEffect(() => {
    if (controlledStatus !== undefined) setInternalStatus(controlledStatus);
  }, [controlledStatus]);

  const currentStatus = controlledStatus ?? internalStatus;
  const tone = STATUS_CONFIG[currentStatus];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleStatusUpdate = (newStatus: TableStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalStatus(newStatus);
    setIsMenuOpen(false);
    onStatusChange?.(newStatus);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={`relative flex w-52 cursor-pointer flex-col gap-3 rounded-2xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-900
        ${
          isSelected
            ? 'border-blue-500 ring-4 ring-blue-500/30'
            : 'border-slate-200 dark:border-slate-700'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between pl-1">
        <span className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Table {tableNumber}
        </span>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Table options"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            className="rounded-md p-1 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-800"
          >
            <MoreVertical className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800"
            >
              {currentStatus !== 'unavailable' ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={(e) => handleStatusUpdate('unavailable', e)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-amber-600 hover:bg-slate-100 dark:text-amber-400 dark:hover:bg-slate-700"
                >
                  <Ban className="h-4 w-4" />
                  Make unbookable
                </button>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  onClick={(e) => handleStatusUpdate('unbooked', e)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-emerald-600 hover:bg-slate-100 dark:text-emerald-400 dark:hover:bg-slate-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Make available
                </button>
              )}
              <button
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onDelete?.();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-slate-100 dark:text-red-400 dark:hover:bg-slate-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete table
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floor with the drawn table: only this part carries the status colour */}
      <div
        className="flex h-32 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/60"
        style={{
          backgroundImage:
            'radial-gradient(rgba(100,116,139,0.22) 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }}
      >
        <TableIllustration capacity={capacity} tone={tone} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-1 pb-0.5">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {capacity} {capacity === 1 ? 'seat' : 'seats'}
        </span>

        <span
          className={`flex items-center gap-1.5 text-xs font-semibold ${tone.text}`}
        >
          <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
          {tone.label}
        </span>
      </div>

      {/* Orders */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOrdersOpen(true);
          onViewOrders?.(tableId);
        }}
        className="w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
      >
        View orders
      </button>

      <TableOrdersDialog
        open={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        tableId={tableId}
        tableNumber={tableNumber}
      />
    </div>
  );
}