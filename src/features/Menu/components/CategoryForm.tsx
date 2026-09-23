import React, { useState } from 'react';

interface CategoryFormProps {
  onClose: () => void;
}

export default function CategoryForm({
  onClose,
}: CategoryFormProps) {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      name,
      image,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Add Category
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">

            {/* Category Name */}
            <div className="space-y-2">
              <label
                htmlFor="category-name"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Category Name
              </label>

              <input
                id="category-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Breakfast"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Image */}
            <div className="space-y-2">
              <label
                htmlFor="category-image"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Category Image
                <span className="ml-1 text-slate-400">
                  (Optional)
                </span>
              </label>

              <input
                id="category-image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(e.target.files?.[0] ?? null)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}