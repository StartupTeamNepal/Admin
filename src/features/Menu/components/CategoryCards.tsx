interface DishCategoryCardProps {
  title: string;
  description: string;
  displayOrder: number;
  selected?: boolean;
  onClick?: () => void;
}

export default function DishCategoryCard({
  title,
  description,
  displayOrder,
  selected = false,
  onClick,
}: DishCategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected
          ? "border-blue-600 ring-2 ring-blue-500"
          : "border-slate-200 hover:border-slate-400"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {description || "No description"}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          #{displayOrder}
        </span>
      </div>
    </button>
  );
}