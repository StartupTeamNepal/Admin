import React, { useEffect, useState } from "react";
import AddButton from "../components/AddButton";
import { useLocation,useNavigate } from "react-router";
import {
  getMenuItems,
  type MenuItem,
} from "../api/MenuItems";

export default function Menupage() {
  const navigate = useNavigate();
  const location =useLocation();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAddMenu = () => {
    navigate("/menu-add");
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMenuItems();

      setItems(response.data.items);
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
      setError("Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchMenuItems();
}, [location.pathname]);

  const availableItems = items.filter(
    (item) => item.isAvailable
  );

  return (
    <div className="w-full p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Menu
        </h1>

        <AddButton
          label="Add Menu Option"
          ariaLabel="Add menu option"
          onClick={handleAddMenu}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-10 text-center text-sm text-muted-foreground">
          Loading dishes...
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
            onClick={fetchMenuItems}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        availableItems.length === 0 && (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No available dishes found.
            </p>

            <button
              type="button"
              onClick={handleAddMenu}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add your first dish
            </button>
          </div>
        )}

      {/* Available dishes */}
      {!loading &&
        !error &&
        availableItems.length > 0 && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Available Dishes
              </h2>

              <p className="text-sm text-muted-foreground">
                {availableItems.length}{" "}
                {availableItems.length === 1 ? "dish" : "dishes"} available
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md dark:bg-slate-950"
                >
                  {/* Image */}
                  <div className="h-44 bg-slate-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </h3>

                      <span className="shrink-0 font-semibold text-blue-600">
                        Rs. {item.basePrice}
                      </span>
                    </div>

                    <p className="mb-2 text-xs font-medium text-slate-500">
                      {item.categoryName}
                    </p>

                    <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                      {item.description || "No description"}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {item.preparationTime} min
                      </span>

                      <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}