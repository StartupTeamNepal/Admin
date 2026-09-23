import React, { useState } from 'react'
import DishCategoryCard from '../components/CategoryCards'
import AddButton from '../components/AddButton'
import CategoryForm from '../components/CategoryForm'
import DishForm from '../components/DishForm'
import { Card } from '@/components/ui/card'

const categories = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Warm drinks',
  'Soft Drinks',
  'Hard Drinks',
]

export default function Categorypage() {
  const [formOpen, setFormOpen] = useState(false)
  const [step, setStep] = useState<'category' | 'dish'>('category')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleNext = () => {
    if (!selectedCategory) return

    setStep('dish')
  }

  const handleBack = () => {
    setStep('category')
  }

  return (
    <div className="w-full p-4">

      {/* Page title */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold">
          Menu
        </h1>
      </div>

      {/* Category step */}
      {step === 'category' && (
        <Card className="max-h-[80vh] overflow-y-auto p-4">

          {/* Card header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Choose a category
            </h2>

            <AddButton
              label="Add Category"
              ariaLabel="Add category"
              onClick={() => setFormOpen(true)}
            />
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <DishCategoryCard
                key={category}
                title={category}
                selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedCategory}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>

        </Card>
      )}

      {/* Dish step */}
      {step === 'dish' && (
        <DishForm
          category={selectedCategory}
          onBack={handleBack}
        />
      )}

      {/* Add Category form */}
      {formOpen && (
        <CategoryForm
          onClose={() => setFormOpen(false)}
        />
      )}

    </div>
  )
}