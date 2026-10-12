import React, { useEffect, useState } from "react";
import {
  createMenuCategory,
  type CreateMenuCategoryRequest,
} from "../api/Categorylinks";

interface CategoryFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass =
  "block w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 " +
  "placeholder:text-stone-400 shadow-sm transition " +
  "focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 " +
  "disabled:cursor-not-allowed disabled:bg-stone-100 disabled:opacity-60 " +
  "dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500 " +
  "dark:focus:border-blue-500 dark:focus:ring-blue-500/30 dark:disabled:bg-stone-800";

const labelClass =
  "block text-sm font-medium text-stone-800 dark:text-stone-200";

export default function CategoryForm({
  onClose,
  onSuccess,
}: CategoryFormProps) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape (unless a save is in progress)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loading, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    const payload: CreateMenuCategoryRequest = {
      categoryName: categoryName.trim(),
      description: description.trim(),
      displayOrder,
    };

    try {
      setLoading(true);
      setError(null);

      await createMenuCategory(payload);

      // Notify parent that category was successfully created
      onSuccess?.();

      // Close modal
      onClose();
    } catch (error) {
      console.error("Failed to create menu category:", error);

      setError("Couldn't save the category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={() => !loading && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
        className="flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4 sm:px-6 sm:py-5 dark:border-stone-800">
          <div>
            <h2
              id="category-form-title"
              className="text-lg font-semibold tracking-tight text-stone-900 sm:text-xl dark:text-stone-100"
            >
              Add a category
            </h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Categories group dishes on your menu, like Breakfast or Drinks.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="-mr-2 -mt-1 rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L8.94 10l-4.72 4.72a.75.75 0 1 0 1.06 1.06L10 11.06l4.72 4.72a.75.75 0 1 0 1.06-1.06L11.06 10l4.72-4.72a.75.75 0 0 0-1.06-1.06L10 8.94 5.28 4.22Z" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM9 6a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0V6Zm1 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Category Name */}
            <div>
              <label htmlFor="category-name" className={labelClass}>
                Category name
              </label>
              <input
                id="category-name"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Breakfast"
                disabled={loading}
                required
                autoFocus
                className={inputClass + " mt-1.5"}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="category-description" className={labelClass}>
                Description
                <span className="ml-1 font-normal text-stone-400">
                  (optional)
                </span>
              </label>
              <textarea
                id="category-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Morning meals served until 11 AM"
                rows={3}
                disabled={loading}
                className={inputClass + " mt-1.5 resize-none"}
              />
            </div>

            {/* Display Order */}
            <div className="sm:max-w-[200px]">
              <label htmlFor="category-display-order" className={labelClass}>
                Display order
              </label>
              <input
                id="category-display-order"
                type="number"
                min={0}
                step={1}
                value={displayOrder}
                onChange={(e) =>
                  setDisplayOrder(
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
                disabled={loading}
                className={inputClass + " mt-1.5"}
              />
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                Lower numbers appear first.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-stone-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:text-stone-300 dark:hover:bg-stone-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:focus-visible:ring-offset-stone-900"
            >
              {loading && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  />
                  <path
                    d="M4 12a8 8 0 0 1 8-8"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="opacity-90"
                  />
                </svg>
              )}
              {loading ? "Saving…" : "Save category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}