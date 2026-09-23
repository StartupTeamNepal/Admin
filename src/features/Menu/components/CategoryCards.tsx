interface DishCategoryCardProps {
  title: string
  image?: string
  selected?: boolean
  onClick?: () => void
}

export default function DishCategoryCard({
  title,
  image,
  selected = false,
  onClick,
}: DishCategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full overflow-hidden rounded-xl border text-left transition ${
        selected
          ? 'border-blue-600 ring-2 ring-blue-500'
          : 'border-slate-200 hover:border-slate-400'
      }`}
    >
      <div className="flex h-40 items-center justify-center bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm text-slate-400">
            No image
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold">
          {title}
        </h3>
      </div>
    </button>
  )
}