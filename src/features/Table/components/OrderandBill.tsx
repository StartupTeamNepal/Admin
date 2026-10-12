import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Loader2, Printer, Receipt, X } from "lucide-react";
// Adjust this path to wherever your table-orders API file lives
import { getBillByOrderId, getOrdersByTableId } from "../api/orderlinks";

/* ------------------------------------------------------------------ */
/*  Shared class names (same idea as inputClass in the forms)         */
/*  Buttons are blue. Emerald only shows up in the focus ring.        */
/* ------------------------------------------------------------------ */

// Two-tone focus ring: blue ring with an emerald outline just outside it
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-emerald-500 focus-visible:ring-2 focus-visible:ring-blue-500";

const btnBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  FOCUS;

const btnPrimary =
  btnBase + " bg-blue-600 px-4 py-2.5 text-white shadow-sm hover:bg-blue-700";

const btnSecondary =
  btnBase +
  " border border-stone-300 bg-white px-4 py-2.5 text-stone-700 shadow-sm hover:bg-stone-50 " +
  "dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800";

const btnIcon =
  "rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 " +
  "dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100 " +
  FOCUS;

const cardClass =
  "rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-900";

/* ------------------------------------------------------------------ */
/*  Types the dialog works with                                       */
/*  The API response shape isn't known, so the normalisers below      */
/*  accept several common field names. Adjust them if yours differ.   */
/* ------------------------------------------------------------------ */

interface LineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface OrderView {
  id: string;
  label: string;
  status?: string;
  createdAt?: string;
  items: LineItem[];
  total: number;
}

interface BillExtra {
  label: string;
  amount: number;
}

interface BillView {
  lines: LineItem[];
  extras: BillExtra[];
  total: number;
  date: Date;
}

type Raw = Record<string, unknown>;

const isObj = (v: unknown): v is Raw =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const pick = (o: Raw, keys: string[]): unknown => {
  for (const k of keys) {
    if (o[k] !== undefined && o[k] !== null) return o[k];
  }
  return undefined;
};

const num = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const str = (v: unknown): string | undefined =>
  v === undefined || v === null ? undefined : String(v);

const ITEM_KEYS = ["items", "orderItems", "lineItems", "dishes", "details"];

function toArray(data: unknown, keys: string[]): unknown[] {
  if (Array.isArray(data)) return data;
  if (isObj(data)) {
    for (const k of keys) {
      const v = data[k];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

function normalizeLine(raw: unknown): LineItem {
  const r = isObj(raw) ? raw : {};
  const base = str(pick(r, ["dishName", "menuItemName", "itemName", "name"])) ?? "Item";
  const variant = str(pick(r, ["variantName", "variant"]));
  const quantity = num(pick(r, ["quantity", "qty"]), 1);
  const unitPrice = num(pick(r, ["unitPrice", "price", "basePrice"]));
  const total = num(
    pick(r, ["totalPrice", "lineTotal", "subTotal", "subtotal", "amount"]),
    unitPrice * quantity
  );
  return {
    name: variant ? `${base} (${variant})` : base,
    quantity,
    unitPrice,
    total,
  };
}

function normalizeOrders(data: unknown): OrderView[] {
  return toArray(data, ["orders", "items"]).map((raw, index) => {
    const r = isObj(raw) ? raw : {};
    const id = String(pick(r, ["id", "orderId"]) ?? index);
    const orderNumber = str(pick(r, ["orderNumber", "number"]));
    const items = toArray(r, ITEM_KEYS).map(normalizeLine);
    return {
      id,
      label: orderNumber ? `Order #${orderNumber}` : `Order #${id.slice(0, 8)}`,
      status: str(pick(r, ["status", "orderStatus"])),
      createdAt: str(pick(r, ["createdAt", "orderedAt", "orderDate"])),
      items,
      total: num(
        pick(r, ["totalAmount", "grandTotal", "total"]),
        items.reduce((s, i) => s + i.total, 0)
      ),
    };
  });
}

const EXTRA_DEFS: Array<{ label: string; keys: string[]; negative?: boolean }> = [
  { label: "Subtotal", keys: ["subTotal", "subtotal"] },
  { label: "Service charge", keys: ["serviceCharge"] },
  { label: "Tax", keys: ["taxAmount", "tax", "vat"] },
  { label: "Discount", keys: ["discountAmount", "discount"], negative: true },
];

function normalizeBill(data: unknown): Omit<BillView, "date"> {
  const r = isObj(data) ? data : {};
  const lines = toArray(r, ITEM_KEYS).map(normalizeLine);
  const extras: BillExtra[] = [];

  for (const def of EXTRA_DEFS) {
    const value = num(pick(r, def.keys));
    if (value > 0) {
      extras.push({ label: def.label, amount: def.negative ? -value : value });
    }
  }

  return {
    lines,
    extras,
    total: num(
      pick(r, ["totalAmount", "grandTotal", "total", "netAmount", "payableAmount"]),
      lines.reduce((s, l) => s + l.total, 0)
    ),
  };
}

/** Combine the bills of several orders into one bill for the table */
function mergeBills(parts: Array<Omit<BillView, "date">>): BillView {
  const lineMap = new Map<string, LineItem>();
  const extraMap = new Map<string, number>();
  let total = 0;

  for (const part of parts) {
    total += part.total;
    for (const line of part.lines) {
      const key = `${line.name}|${line.unitPrice}`;
      const existing = lineMap.get(key);
      if (existing) {
        existing.quantity += line.quantity;
        existing.total += line.total;
      } else {
        lineMap.set(key, { ...line });
      }
    }
    for (const extra of part.extras) {
      extraMap.set(extra.label, (extraMap.get(extra.label) ?? 0) + extra.amount);
    }
  }

  return {
    lines: Array.from(lineMap.values()),
    extras: Array.from(extraMap, ([label, amount]) => ({ label, amount })),
    total,
    date: new Date(),
  };
}

/* ------------------------------------------------------------------ */
/*  Formatting + print                                                */
/* ------------------------------------------------------------------ */

const money = (n: number) =>
  `${n < 0 ? "- " : ""}Rs. ${Math.abs(n).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDateTime = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(d);

const formatTime = (value?: string) => {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : formatDateTime(d);
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );

function printBill(bill: BillView, tableNumber: string) {
  const rows = bill.lines
    .map(
      (l) =>
        `<tr><td>${esc(l.name)}</td><td class="r">${l.quantity}</td><td class="r">${esc(money(l.total))}</td></tr>`
    )
    .join("");
  const extras = bill.extras
    .map(
      (e) =>
        `<tr class="x"><td colspan="2">${esc(e.label)}</td><td class="r">${esc(money(e.amount))}</td></tr>`
    )
    .join("");

  const w = window.open("", "_blank", "width=420,height=640");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><title>Bill - Table ${tableNumber}</title>
<style>
  body{font-family:system-ui,sans-serif;margin:24px;color:#0f172a}
  h1{font-size:18px;margin:0 0 4px;text-align:center}
  p{margin:2px 0;font-size:13px}
  table{width:100%;border-collapse:collapse;margin-top:14px;font-size:13px}
  th{text-align:left;border-bottom:1px dashed #94a3b8;padding:6px 0}
  td{padding:6px 0}
  .r{text-align:right}
  th.r{text-align:right}
  .x td{color:#475569}
  .t td{border-top:1px dashed #94a3b8;font-weight:700;font-size:15px;padding-top:10px}
</style></head><body>
<h1>Bill</h1>
<p>Date: ${esc(formatDateTime(bill.date))}</p>
<p>Table: ${tableNumber}</p>
<table><thead><tr><th>Dish</th><th class="r">Qty</th><th class="r">Price</th></tr></thead>
<tbody>${rows}${extras}<tr class="t"><td colspan="2">Total</td><td class="r">${esc(money(bill.total))}</td></tr></tbody></table>
</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

/* ------------------------------------------------------------------ */
/*  Dialog                                                            */
/* ------------------------------------------------------------------ */

export interface TableOrdersDialogProps {
  open: boolean;
  onClose: () => void;
  tableId: string;
  tableNumber: string;
}

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function TableOrdersDialog({
  open,
  onClose,
  tableId,
  tableNumber,
}: TableOrdersDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef(0);

  const [view, setView] = useState<"orders" | "bill">("orders");

  const [orders, setOrders] = useState<OrderView[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [bill, setBill] = useState<BillView | null>(null);
  const [billLoading, setBillLoading] = useState(false);
  const [billError, setBillError] = useState<string | null>(null);
  const [billSkipped, setBillSkipped] = useState(0);

  const loadOrders = useCallback(async () => {
    const requestId = ++requestRef.current;
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const res = await getOrdersByTableId(tableId);
      if (requestId !== requestRef.current) return;
      setOrders(normalizeOrders(res.data));
    } catch (err) {
      if (requestId !== requestRef.current) return;
      console.error("Failed to load table orders:", err);
      setOrdersError("Couldn't load the orders.");
    } finally {
      if (requestId === requestRef.current) setOrdersLoading(false);
    }
  }, [tableId]);

  // Load fresh data every time the dialog opens
  useEffect(() => {
    if (!open) return;
    setView("orders");
    setBill(null);
    setBillError(null);
    setOrders([]);
    loadOrders();
    return () => {
      requestRef.current++;
    };
  }, [open, loadOrders]);

  // Focus handling + scroll lock
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const generateBill = async () => {
    if (orders.length === 0 || billLoading) return;
    setView("bill");
    setBill(null);
    setBillError(null);
    setBillSkipped(0);
    setBillLoading(true);

    const results = await Promise.allSettled(
      orders.map((o) => getBillByOrderId(o.id))
    );

    const parts = results
      .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getBillByOrderId>>> =>
        r.status === "fulfilled"
      )
      .map((r) => normalizeBill(r.value.data));

    if (parts.length === 0) {
      console.error("Failed to generate bill:", results);
      setBillError("Couldn't generate the bill.");
    } else {
      setBill(mergeBills(parts));
      setBillSkipped(results.length - parts.length);
    }
    setBillLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;

    const nodes = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    );
    if (nodes.length === 0) {
      e.preventDefault();
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && (active === first || active === dialogRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  const grandTotal = orders.reduce((s, o) => s + o.total, 0);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      // Portal events bubble through React's tree: keep clicks off the table card
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl outline-none sm:max-w-lg sm:rounded-2xl dark:bg-stone-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-4 py-4 sm:px-6 dark:border-stone-800">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="truncate text-lg font-semibold tracking-tight text-stone-900 sm:text-xl dark:text-stone-100"
            >
              Table {tableNumber}
            </h2>
            <p className="text-xs text-stone-500 sm:text-sm dark:text-stone-400">
              {view === "orders" ? "Current orders" : "Bill"}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {view === "orders" ? (
              <button
                type="button"
                onClick={generateBill}
                disabled={ordersLoading || orders.length === 0}
                className={btnPrimary + " !px-3 !py-2"}
              >
                <Receipt className="h-4 w-4" />
                Get bill
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setView("orders")}
                className={btnSecondary + " !px-3 !py-2"}
              >
                <ArrowLeft className="h-4 w-4" />
                Orders
              </button>
            )}

            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className={btnIcon}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-stone-50 px-4 py-4 sm:px-6 sm:py-5 dark:bg-stone-950/40">
          {view === "orders" && (
            <>
              {ordersLoading && (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-stone-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading orders…
                </div>
              )}

              {!ordersLoading && ordersError && (
                <div className="py-10 text-center">
                  <p className="mb-3 text-sm text-red-600 dark:text-red-400">
                    {ordersError}
                  </p>
                  <button
                    type="button"
                    onClick={loadOrders}
                    className={btnSecondary}
                  >
                    Try again
                  </button>
                </div>
              )}

              {!ordersLoading && !ordersError && orders.length === 0 && (
                <div className="rounded-xl border border-dashed border-stone-300 bg-white px-4 py-10 text-center dark:border-stone-700 dark:bg-stone-900">
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-200">
                    No orders yet
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    Orders placed for this table will show up here.
                  </p>
                </div>
              )}

              {!ordersLoading && !ordersError && orders.length > 0 && (
                <div className="flex flex-col gap-3">
                  {orders.map((order) => (
                    <article key={order.id} className={cardClass}>
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                            {order.label}
                          </h3>
                          {formatTime(order.createdAt) && (
                            <p className="mt-0.5 text-xs text-stone-500">
                              {formatTime(order.createdAt)}
                            </p>
                          )}
                        </div>
                        {order.status && (
                          <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700 ring-1 ring-inset ring-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700">
                            {order.status}
                          </span>
                        )}
                      </div>

                      <ul className="flex flex-col gap-2">
                        {order.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start justify-between gap-3 text-sm text-stone-700 dark:text-stone-300"
                          >
                            <span className="flex min-w-0 gap-2">
                              <span className="shrink-0 rounded bg-stone-100 px-1.5 text-xs font-medium leading-5 tabular-nums text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                                {item.quantity}×
                              </span>
                              <span className="min-w-0 break-words">
                                {item.name}
                              </span>
                            </span>
                            <span className="shrink-0 tabular-nums">
                              {money(item.total)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-3 flex justify-between border-t border-stone-200 pt-3 text-sm font-semibold text-stone-900 dark:border-stone-800 dark:text-stone-100">
                        <span>Order total</span>
                        <span className="tabular-nums">{money(order.total)}</span>
                      </div>
                    </article>
                  ))}

                  <div className="flex items-center justify-between rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white dark:bg-stone-100 dark:text-stone-900">
                    <span>
                      Table total ({orders.length}{" "}
                      {orders.length === 1 ? "order" : "orders"})
                    </span>
                    <span className="tabular-nums">{money(grandTotal)}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {view === "bill" && (
            <>
              {billLoading && (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-stone-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating bill…
                </div>
              )}

              {!billLoading && billError && (
                <div className="py-10 text-center">
                  <p className="mb-3 text-sm text-red-600 dark:text-red-400">
                    {billError}
                  </p>
                  <button
                    type="button"
                    onClick={generateBill}
                    className={btnSecondary}
                  >
                    Try again
                  </button>
                </div>
              )}

              {!billLoading && bill && (
                <>
                  {billSkipped > 0 && (
                    <p
                      role="alert"
                      className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300"
                    >
                      The bill could not be generated for {billSkipped} of{" "}
                      {orders.length} orders, so this total may be incomplete.
                    </p>
                  )}

                  <div className="rounded-xl border border-dashed border-stone-300 bg-white p-4 sm:p-5 dark:border-stone-600 dark:bg-stone-900">
                    <h3 className="mb-3 text-center text-base font-semibold text-stone-900 dark:text-stone-100">
                      Bill
                    </h3>

                    <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                      <dt className="text-stone-500">Date</dt>
                      <dd className="text-right text-stone-900 dark:text-stone-100">
                        {formatDateTime(bill.date)}
                      </dd>
                      <dt className="text-stone-500">Table</dt>
                      <dd className="text-right text-stone-900 dark:text-stone-100">
                        {tableNumber}
                      </dd>
                    </dl>

                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-y border-dashed border-stone-300 text-left text-stone-500 dark:border-stone-600">
                          <th className="py-2 font-medium">Dish</th>
                          <th className="py-2 text-right font-medium">Qty</th>
                          <th className="py-2 text-right font-medium">Price</th>
                        </tr>
                      </thead>
                      <tbody className="text-stone-800 dark:text-stone-200">
                        {bill.lines.map((line, i) => (
                          <tr key={i}>
                            <td className="py-1.5 pr-2">{line.name}</td>
                            <td className="py-1.5 text-right tabular-nums">
                              {line.quantity}
                            </td>
                            <td className="py-1.5 text-right tabular-nums">
                              {money(line.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        {bill.extras.map((extra) => (
                          <tr key={extra.label} className="text-stone-500">
                            <td colSpan={2} className="py-1">
                              {extra.label}
                            </td>
                            <td className="py-1 text-right tabular-nums">
                              {money(extra.amount)}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-dashed border-stone-300 text-base font-semibold text-stone-900 dark:border-stone-600 dark:text-stone-100">
                          <td colSpan={2} className="pt-3">
                            Total
                          </td>
                          <td className="pt-3 text-right tabular-nums">
                            {money(bill.total)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer (bill only) */}
        {view === "bill" && bill && !billLoading && (
          <div className="flex border-t border-stone-200 px-4 py-3 sm:justify-end sm:px-6 dark:border-stone-800">
            <button
              type="button"
              onClick={() => printBill(bill, tableNumber)}
              className={btnPrimary + " w-full sm:w-auto"}
            >
              <Printer className="h-4 w-4" />
              Print bill
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}