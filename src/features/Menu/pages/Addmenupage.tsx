import React, { useEffect, useState } from "react";
import DishCategoryCard from "../components/CategoryCards";
import AddButton from "../components/AddButton";
import CategoryForm from "../components/CategoryForm";
import DishForm from "../components/DishForm";
import { Card } from "@/components/ui/card";
import {
  getMenuCategories,
   type MenuCategory,
} from "../api/Categorylinks";
import { useNavigate } from "react-router-dom";


export default function Categorypage() {
  const [formOpen, setFormOpen] = useState(false);
  const [step, setStep] = useState<"category" | "dish">("category");

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategory | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // =========================
  // Fetch Categories
  // =========================
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMenuCategories();

      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch menu categories:", error);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // Category Selection
  // =========================
  const handleCategorySelect = (category: MenuCategory) => {
    setSelectedCategory(category);
  };

  // =========================
  // Go to Dish Step
  // =========================
  const handleNext = () => {
    if (!selectedCategory) return;

    setStep("dish");
  };

  // =========================
  // Back to Category Step
  // =========================
  const handleBack = () => {
    setStep("category");
  };

  // =========================
  // Category Added
  // =========================
  const handleCategoryAdded = async () => {
    setFormOpen(false);
    await fetchCategories();
  };

  return (
    <div className="w-full p-4">

      {/* Page title */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold">
          Menu
        </h1>
      </div>

      {/* =========================
          Category Step
         ========================= */}
      {step === "category" && (
        <Card className="max-h-[80vh] overflow-y-auto p-4">

          {/* Header */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">
              Choose a category
            </h2>

            <AddButton
              label="Add Category"
              ariaLabel="Add category"
              onClick={() => setFormOpen(true)}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading categories...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-10 text-center">
              <p className="mb-3 text-sm text-red-500">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchCategories}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && categories.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No categories found. Add your first category.
            </div>
          )}

          {/* Categories */}
          {!loading && !error && categories.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => (
                <DishCategoryCard
                  key={category.id}
                  title={category.categoryName}
                  description={category.description}
                  displayOrder={category.displayOrder}
                  selected={selectedCategory?.id === category.id}
                  onClick={() => handleCategorySelect(category)}
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {setSelectedCategory(null) ;navigate("/menu");}}
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

      {/* =========================
          Dish Step
         ========================= */}
      {step === "dish" && selectedCategory && (
        <DishForm
          category={selectedCategory}
          onBack={handleBack}
        />
      )}

      {/* =========================
          Add Category Form
         ========================= */}
      {formOpen && (
        <CategoryForm
          onClose={() => setFormOpen(false)}
          onSuccess={handleCategoryAdded}
        />
      )}

    </div>
  );
}