import React, { useState } from 'react'
import { Card } from '@/components/ui/card'

interface DishFormProps {
  category: string | null
  onBack: () => void
}

export default function DishForm({
  category,
  onBack,
}: DishFormProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log({
      category,
      name,
      price,
      image,
    })
  }

  return (
    <Card className="mx-auto w-full max-w-2xl p-6">

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Add Dish
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Category: {category}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="dish-name"
            className="text-sm font-medium"
          >
            Dish Name
          </label>

          <input
            id="dish-name"
            type="text"
            placeholder="Enter dish name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label
            htmlFor="dish-price"
            className="text-sm font-medium"
          >
            Price
          </label>

          <input
            id="dish-price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Image */}
        <div className="space-y-2">
          <label
            htmlFor="dish-image"
            className="text-sm font-medium"
          >
            Dish Image
            <span className="ml-1 text-slate-400">
              (Optional)
            </span>
          </label>

          <input
            id="dish-image"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files?.[0] ?? null)
            }
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between border-t pt-5">

          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            ← Go Back
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save Dish
          </button>

        </div>

      </form>
    </Card>
  )
}