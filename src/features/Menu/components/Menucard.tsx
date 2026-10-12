import React, { useEffect, useRef, useState } from "react";
import { Clock, MoreVertical, Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import type { MenuItem } from "../api/MenuItems";

export interface MenuCardProps {
  item: MenuItem;
  onSelect?: (item: MenuItem) => void;
  /** If provided, an "Edit dish" entry appears in the 3-dot menu */
  onEdit?: (item: MenuItem) => void;
  /** If provided, a "Delete dish" entry appears in the 3-dot menu */
  onDelete?: (item: MenuItem) => void;
}

function formatPrice(value: number | string): string {
  const n = Number(value);
  return Number.isNaN(n) ? String(value) : n.toLocaleString("en-IN");
}

export default function MenuCard({
  item,
  onSelect,
  onEdit,
  onDelete,
}: MenuCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const hasMenu = Boolean(onEdit || onDelete);
  const showImage = Boolean(item.imageUrl) && !imageFailed;

  // Reset the fallback if the image url changes
  useEffect(() => {
    setImageFailed(false);
  }, [item.imageUrl]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onSelect || e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(item);
    }
  };

  const clickable = Boolean(onSelect);

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => onSelect?.(item) : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      className={`group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 ${
        clickable ? "cursor-pointer" : ""
      }`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
        {showImage ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500"
            style={{
              backgroundImage:
                "radial-gradient(rgba(100,116,139,0.22) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
          >
            <UtensilsCrossed className="h-8 w-8" />
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Category chip */}
        {item.categoryName && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/85 dark:text-slate-200">
            {item.categoryName}
          </span>
        )}

        {/* Menu */}
        {hasMenu && (
          <div className="absolute right-2 top-2" ref={menuRef}>
            <button
              type="button"
              aria-label={`Options for ${item.name}`}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((p) => !p);
              }}
              className="rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-900/85 dark:hover:bg-slate-900"
            >
              <MoreVertical className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800"
              >
                {onEdit && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onEdit(item);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit dish
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onDelete(item);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-slate-100 dark:text-red-400 dark:hover:bg-slate-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete dish
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900 dark:text-slate-100">
            {item.name}
          </h3>
          <span className="shrink-0 rounded-lg bg-blue-50 px-2 py-0.5 text-sm font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            Rs. {formatPrice(item.basePrice)}
          </span>
        </div>

        <p className="line-clamp-2 min-h-[2.5rem] text-sm text-slate-500 dark:text-slate-400">
          {item.description || "No description"}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-1 pt-3 dark:border-slate-800">
        <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Clock className="h-4 w-4" />
          {item.preparationTime} min
        </span>

        <span
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            item.isAvailable
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              item.isAvailable ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
          {item.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>
    </div>
  );
}