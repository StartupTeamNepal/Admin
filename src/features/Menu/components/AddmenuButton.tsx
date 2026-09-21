import React from 'react';
import { Plus } from 'lucide-react';

interface AddMenuOptionButtonProps {
  onAdd: () => void;
}

export default function AddMenuOptionButton({
  onAdd,
}: AddMenuOptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label="Add menu option"
      className="
        inline-flex items-center justify-center
        gap-2
        rounded-lg
        bg-blue-600
        px-3 py-2
        text-sm font-medium text-white
        shadow-sm
        transition-colors
        hover:bg-blue-700
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-2
      "
    >
      <Plus className="h-5 w-5" />

      {/* Hidden on small screens */}
      <span className="hidden sm:inline">
        Add Menu Option
      </span>
    </button>
  );
}