import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  createMenuItem,
   type CreateMenuItemRequest,
} from "../api/MenuItems";
import {type  MenuCategory } from "../api/Categorylinks";

interface Variant {
  name: string;
  additionalPrice: string;
  isAvailable: boolean;
}

interface DishFormProps {
  category: MenuCategory | null;
  onBack: () => void;
  onSuccess?: () => void;
}

export default function DishForm({
  category,
  onBack,
  onSuccess,
}: DishFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [preparationTime, setPreparationTime] = useState("");
  const [isSpecialOffer, setIsSpecialOffer] = useState(false);
  const [specialOfferPrice, setSpecialOfferPrice] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");

  const [variants, setVariants] = useState<Variant[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // Variant Functions
  // =========================

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        name: "",
        additionalPrice: "",
        isAvailable: true,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | boolean
  ) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!name.trim()) {
      setError("Dish name is required.");
      return;
    }

    if (!basePrice || Number(basePrice) < 0) {
      setError("Please enter a valid base price.");
      return;
    }

    if (
      isSpecialOffer &&
      (!specialOfferPrice ||
        Number(specialOfferPrice) < 0)
    ) {
      setError("Please enter a valid special offer price.");
      return;
    }

    const payload: CreateMenuItemRequest = {
      name: name.trim(),
      description: description.trim(),
      basePrice: Number(basePrice),
      imageUrl: imageUrl.trim(),
      isAvailable,
      preparationTime: Number(preparationTime),
      isSpecialOffer,
      specialOfferPrice: isSpecialOffer
        ? Number(specialOfferPrice)
        : 0,
      displayOrder: Number(displayOrder),
      variants: variants.map((variant) => ({
        name: variant.name.trim(),
        additionalPrice: Number(
          variant.additionalPrice
        ),
        isAvailable: variant.isAvailable,
      })),
    };

    try {
      setLoading(true);
      setError(null);

      console.log("Selected category:", category);
      console.log("Creating menu item:", payload);

      await createMenuItem(payload);

      onSuccess?.();
    } catch (error) {
      console.error("Failed to create menu item:", error);

      setError(
        "Failed to create dish. Please check your information and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 border-b pb-5">
        <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
          Add Dish
        </h2>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Category:{" "}
          <span className="font-medium text-slate-700">
            {category?.categoryName ?? "No category selected"}
          </span>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 sm:space-y-6"
      >

        {/* Main fields */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

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
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              disabled={loading}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 disabled:opacity-60"
            />
          </div>

          {/* Base Price */}
          <div className="space-y-2">
            <label
              htmlFor="dish-base-price"
              className="text-sm font-medium"
            >
              Base Price
            </label>

            <input
              id="dish-base-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter base price"
              value={basePrice}
              onChange={(e) =>
                setBasePrice(e.target.value)
              }
              required
              disabled={loading}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 disabled:opacity-60"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label
              htmlFor="dish-image-url"
              className="text-sm font-medium"
            >
              Image URL
              <span className="ml-1 text-slate-400">
                (Optional)
              </span>
            </label>

            <input
              id="dish-image-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) =>
                setImageUrl(e.target.value)
              }
              disabled={loading}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 disabled:opacity-60"
            />
          </div>

          {/* Preparation Time */}
          <div className="space-y-2">
            <label
              htmlFor="preparation-time"
              className="text-sm font-medium"
            >
              Preparation Time
              <span className="ml-1 text-slate-400">
                (minutes)
              </span>
            </label>

            <input
              id="preparation-time"
              type="number"
              min="0"
              placeholder="e.g. 20"
              value={preparationTime}
              onChange={(e) =>
                setPreparationTime(e.target.value)
              }
              required
              disabled={loading}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 disabled:opacity-60"
            />
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <label
              htmlFor="display-order"
              className="text-sm font-medium"
            >
              Display Order
            </label>

            <input
              id="display-order"
              type="number"
              min="0"
              placeholder="e.g. 1"
              value={displayOrder}
              onChange={(e) =>
                setDisplayOrder(e.target.value)
              }
              required
              disabled={loading}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="dish-description"
            className="text-sm font-medium"
          >
            Description
          </label>

          <textarea
            id="dish-description"
            placeholder="Enter dish description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={3}
            disabled={loading}
            className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 disabled:opacity-60"
          />
        </div>

        {/* Status Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Availability */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="pr-4">
              <p className="text-sm font-medium">
                Available
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Available for ordering
              </p>
            </div>

            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) =>
                setIsAvailable(e.target.checked)
              }
              disabled={loading}
              className="h-4 w-4 shrink-0"
            />
          </div>

          {/* Special Offer */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="pr-4">
              <p className="text-sm font-medium">
                Special Offer
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Enable special pricing
              </p>
            </div>

            <input
              type="checkbox"
              checked={isSpecialOffer}
              onChange={(e) =>
                setIsSpecialOffer(e.target.checked)
              }
              disabled={loading}
              className="h-4 w-4 shrink-0"
            />
          </div>
        </div>

        {/* Special Offer Price */}
        {isSpecialOffer && (
          <div className="space-y-2">
            <label
              htmlFor="special-offer-price"
              className="text-sm font-medium"
            >
              Special Offer Price
            </label>

            <input
              id="special-offer-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter special offer price"
              value={specialOfferPrice}
              onChange={(e) =>
                setSpecialOfferPrice(e.target.value)
              }
              required
              disabled={loading}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 disabled:opacity-60"
            />
          </div>
        )}

        {/* Variants */}
        <div className="rounded-lg border p-3 sm:p-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold">
                Variants
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Add optional dish variants
              </p>
            </div>

            <button
              type="button"
              onClick={addVariant}
              disabled={loading}
              className="w-full rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              + Add Variant
            </button>
          </div>

          {/* Variant List */}
          {variants.length > 0 && (
            <div className="mt-4 space-y-3">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-slate-50 p-3 sm:p-4"
                >

                  {/* Variant Header */}
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Variant {index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        removeVariant(index)
                      }
                      disabled={loading}
                      className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50 sm:text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Variant Fields */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Name
                      </label>

                      <input
                        type="text"
                        placeholder="e.g. Large"
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        required
                        disabled={loading}
                        className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 disabled:opacity-60"
                      />
                    </div>

                    {/* Additional Price */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Additional Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 50"
                        value={
                          variant.additionalPrice
                        }
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "additionalPrice",
                            e.target.value
                          )
                        }
                        required
                        disabled={loading}
                        className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Variant Availability */}
                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <label className="text-sm font-medium">
                      Available
                    </label>

                    <input
                      type="checkbox"
                      checked={
                        variant.isAvailable
                      }
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "isAvailable",
                          e.target.checked
                        )
                      }
                      disabled={loading}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-between">

          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            ← Go Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Saving..." : "Save Dish"}
          </button>

        </div>
      </form>
    </Card>
  );
}