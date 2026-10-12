import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  createMenuItem,
  type CreateMenuItemRequest,
} from "../api/MenuItems";
import { type MenuCategory } from "../api/Categorylinks";
import { useNavigate } from "react-router-dom";
import ImageUpload from "./ImageUpload";

// Change this to your currency label (e.g. "$", "Rs", "€")
const CURRENCY = "Rs";

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

/* -------------------------------------------------------------------------- */
/* Shared styles                                                              */
/* -------------------------------------------------------------------------- */

const inputClass =
  "block w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 " +
  "placeholder:text-stone-400 shadow-sm transition " +
  "focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 " +
  "disabled:cursor-not-allowed disabled:bg-stone-100 disabled:opacity-60";

const labelClass = "block text-sm font-medium text-stone-800";
const hintClass = "mt-1 text-xs text-stone-500";

/* -------------------------------------------------------------------------- */
/* Small building blocks                                                      */
/* -------------------------------------------------------------------------- */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-5 py-6 first:pt-0 md:grid-cols-[200px_1fr] md:gap-8 lg:grid-cols-[240px_1fr]">
      <div>
        <h3 className="text-base font-semibold text-stone-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-stone-500">
            {description}
          </p>
        )}
      </div>
      <div className="min-w-0 space-y-5">{children}</div>
    </section>
  );
}

function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 " +
        "disabled:cursor-not-allowed disabled:opacity-50 " +
        (checked ? "bg-blue-600" : "bg-stone-300")
      }
    >
      <span
        className={
          "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform " +
          (checked ? "translate-x-[22px]" : "translate-x-0.5")
        }
      />
    </button>
  );
}

function PriceInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-stone-500">
        {CURRENCY}
      </span>
      <input
        type="number"
        min="0"
        step="0.01"
        {...props}
        className={inputClass + " pl-10 " + (props.className ?? "")}
      />
    </div>
  );
}

const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1Z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M8.75 3a1 1 0 0 0-1 1v.5H4.5a.75.75 0 0 0 0 1.5h.6l.6 9.1A2 2 0 0 0 7.7 17h4.6a2 2 0 0 0 2-1.9l.6-9.1h.6a.75.75 0 0 0 0-1.5h-3.25V4a1 1 0 0 0-1-1h-2.5Zm.5 1.5h1.5V5h-1.5v-.5ZM8 8.25a.75.75 0 0 1 1.5 0v5a.75.75 0 0 1-1.5 0v-5Zm3.25-.75a.75.75 0 0 0-.75.75v5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-.75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M17 10a.75.75 0 0 1-.75.75H5.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L5.56 9.25h10.69A.75.75 0 0 1 17 10Z"
      clipRule="evenodd"
    />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function DishForm({
  category,
  onBack,
  onSuccess,
}: DishFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [preparationTime, setPreparationTime] = useState("");
  const [isSpecialOffer, setIsSpecialOffer] = useState(false);
  const [specialOfferPrice, setSpecialOfferPrice] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");

  const [variants, setVariants] = useState<Variant[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // =========================
  // Variant Functions
  // =========================

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { name: "", additionalPrice: "", isAvailable: true },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | boolean
  ) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e: React.FormEvent) => {
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
      (!specialOfferPrice || Number(specialOfferPrice) < 0)
    ) {
      setError("Please enter a valid special offer price.");
      return;
    }

    const formData = new FormData();

    formData.append("categoryId", String(category.id));
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("basePrice", String(Number(basePrice)));

    if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }

    formData.append("isAvailable", String(isAvailable));
    formData.append("preparationTime", String(Number(preparationTime)));
    formData.append("isSpecialOffer", String(isSpecialOffer));

    formData.append(
      "specialOfferPrice",
      isSpecialOffer ? String(Number(specialOfferPrice)) : ""
    );

    formData.append("displayOrder", String(Number(displayOrder)));

    formData.append(
      "variants",
      JSON.stringify(
        variants.map((variant) => ({
          name: variant.name.trim(),
          additionalPrice: Number(variant.additionalPrice),
          isAvailable: variant.isAvailable,
        }))
      )
    );

    try {
      setLoading(true);
      setError(null);

      await createMenuItem(formData);

      onSuccess?.();
      navigate("/menu");
    } catch (error) {
      console.error("Failed to create menu item:", error);

      setError(
        "Couldn't save the dish. Check the details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-6 sm:py-8">
      <Card className="overflow-visible rounded-2xl border-stone-200 bg-white p-0 shadow-sm">
        {/* ------------------------------ Header ------------------------------ */}
        <header className="flex flex-col gap-4 border-b border-stone-200 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
              Add a dish
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Fill in the details below. It will appear on your menu once saved.
            </p>
          </div>

          <div
            className={
              "inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium " +
              (category
                ? "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200"
                : "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200")
            }
          >
            <span
              className={
                "h-2 w-2 rounded-full " +
                (category ? "bg-emerald-600" : "bg-amber-500")
              }
            />
            {category?.categoryName ?? "No category selected"}
          </div>
        </header>

        <form onSubmit={handleSubmit} noValidate={false}>
          <div className="divide-y divide-stone-200 px-4 py-6 sm:px-8 sm:py-8">
            {/* ------------------------------ Error ----------------------------- */}
            {error && (
              <div
                role="alert"
                className="-mt-1 mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
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

            {/* ---------------------------- Basic details ------------------------ */}
            <Section
              title="Dish details"
              description="The name and description customers see on the menu."
            >
              <div>
                <label htmlFor="dish-name" className={labelClass}>
                  Dish name
                </label>
                <input
                  id="dish-name"
                  type="text"
                  placeholder="e.g. Chicken momo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className={inputClass + " mt-1.5"}
                />
              </div>

              <div>
                <label htmlFor="dish-description" className={labelClass}>
                  Description
                  <span className="ml-1 font-normal text-stone-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="dish-description"
                  placeholder="Ingredients, taste, serving size…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  disabled={loading}
                  className={inputClass + " mt-1.5 resize-none"}
                />
              </div>
            </Section>

            {/* ------------------------------- Photo ----------------------------- */}
            <Section
              title="Photo"
              description="A clear, well-lit photo helps the dish sell."
            >
              <ImageUpload
                imageUrl={imageUrl}
                onImageUrlChange={setImageUrl}
                disabled={loading}
                maxSizeMB={5}
              />
            </Section>

            {/* ------------------------------ Pricing ---------------------------- */}
            <Section
              title="Pricing and timing"
              description="Set the price, how long it takes to prepare, and where it shows in the category."
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="dish-base-price" className={labelClass}>
                    Base price
                  </label>
                  <div className="mt-1.5">
                    <PriceInput
                      id="dish-base-price"
                      placeholder="0.00"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="preparation-time" className={labelClass}>
                    Preparation time
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="preparation-time"
                      type="number"
                      min="0"
                      placeholder="e.g. 20"
                      value={preparationTime}
                      onChange={(e) => setPreparationTime(e.target.value)}
                      required
                      disabled={loading}
                      className={inputClass + " pr-16"}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-sm text-stone-500">
                      min
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="display-order" className={labelClass}>
                    Display order
                  </label>
                  <input
                    id="display-order"
                    type="number"
                    min="0"
                    placeholder="e.g. 1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    required
                    disabled={loading}
                    className={inputClass + " mt-1.5"}
                  />
                  <p className={hintClass}>Lower numbers appear first.</p>
                </div>
              </div>
            </Section>

            {/* --------------------------- Availability -------------------------- */}
            <Section
              title="Availability"
              description="Control whether the dish can be ordered and whether it has a special price."
            >
              <div className="divide-y divide-stone-200 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      Available for ordering
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      Turn off to hide the dish from customers temporarily.
                    </p>
                  </div>
                  <Switch
                    checked={isAvailable}
                    onChange={setIsAvailable}
                    disabled={loading}
                    label="Available for ordering"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-stone-900">
                        Special offer
                      </p>
                      <p className="mt-0.5 text-xs text-stone-500">
                        Show a discounted price instead of the base price.
                      </p>
                    </div>
                    <Switch
                      checked={isSpecialOffer}
                      onChange={setIsSpecialOffer}
                      disabled={loading}
                      label="Special offer"
                    />
                  </div>

                  {isSpecialOffer && (
                    <div className="mt-4 sm:max-w-xs">
                      <label
                        htmlFor="special-offer-price"
                        className={labelClass}
                      >
                        Special offer price
                      </label>
                      <div className="mt-1.5">
                        <PriceInput
                          id="special-offer-price"
                          placeholder="0.00"
                          value={specialOfferPrice}
                          onChange={(e) =>
                            setSpecialOfferPrice(e.target.value)
                          }
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Section>

            {/* ------------------------------ Variants --------------------------- */}
            <Section
              title="Variants"
              description="Sizes or options that change the price, like Large or Extra cheese."
            >
              {variants.length === 0 ? (
                <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center">
                  <p className="text-sm font-medium text-stone-700">
                    No variants yet
                  </p>
                  <p className="mx-auto mt-1 max-w-xs text-xs text-stone-500">
                    Skip this if the dish comes in one size at one price.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {variants.map((variant, index) => (
                    <li
                      key={index}
                      className="rounded-xl border border-stone-200 bg-stone-50 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-stone-800">
                          Variant {index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          disabled={loading}
                          aria-label={`Remove variant ${index + 1}`}
                          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
                        >
                          <TrashIcon />
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor={`variant-name-${index}`}
                            className={labelClass}
                          >
                            Name
                          </label>
                          <input
                            id={`variant-name-${index}`}
                            type="text"
                            placeholder="e.g. Large"
                            value={variant.name}
                            onChange={(e) =>
                              updateVariant(index, "name", e.target.value)
                            }
                            required
                            disabled={loading}
                            className={inputClass + " mt-1.5"}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`variant-price-${index}`}
                            className={labelClass}
                          >
                            Additional price
                          </label>
                          <div className="mt-1.5">
                            <PriceInput
                              id={`variant-price-${index}`}
                              placeholder="e.g. 50"
                              value={variant.additionalPrice}
                              onChange={(e) =>
                                updateVariant(
                                  index,
                                  "additionalPrice",
                                  e.target.value
                                )
                              }
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-3">
                        <span className="text-sm text-stone-700">
                          Available
                        </span>
                        <Switch
                          checked={variant.isAvailable}
                          onChange={(value) =>
                            updateVariant(index, "isAvailable", value)
                          }
                          disabled={loading}
                          label={`Variant ${index + 1} available`}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={addVariant}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <PlusIcon />
                Add variant
              </button>
            </Section>
          </div>

          {/* ------------------------------ Actions ----------------------------- */}
          <footer className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 rounded-b-2xl border-t border-stone-200 bg-white/90 px-4 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <ArrowLeftIcon />
              Go back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
              {loading ? "Saving…" : "Save dish"}
            </button>
          </footer>
        </form>
      </Card>
    </div>
  );
}