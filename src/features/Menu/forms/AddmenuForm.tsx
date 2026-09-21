import React from 'react';

interface MenuOptionFormProps {
  onClose: () => void;
}

export default function MenuOptionForm({
  onClose,
}: MenuOptionFormProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-slate-900 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Add Menu Option
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Blank Form */}
        <div className="p-6">
          <div className="h-40 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <span className="text-sm text-slate-400">
              Form will go here
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}