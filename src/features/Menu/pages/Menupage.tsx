import { useEffect, useMemo, useState } from "react";
import AddButton from "../components/AddButton";
import MenuCard from "../components/Menucard";
import { useLocation, useNavigate } from "react-router";
import { getMenuItems, type MenuItem } from "../api/MenuItems";

interface CategoryGroup {
  name: string;
  items: MenuItem[];
}

const UNCATEGORIZED = "Uncategorized";

const slug = (name: string) =>
  `category-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export default function Menupage() {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Available dishes grouped by category (categories keep API order,
  // dishes inside a category are sorted by displayOrder, then name)
  const groups = useMemo<CategoryGroup[]>(() => {
    const map = new Map<string, CategoryGroup>();

    for (const item of items) {
      if (!item.isAvailable) continue;

      const name = item.categoryName?.trim() || UNCATEGORIZED;
      if (!map.has(name)) map.set(name, { name, items: [] });
      map.get(name)!.items.push(item);
    }

    const result = Array.from(map.values());
    result.forEach((group) =>
      group.items.sort(
        (a, b) =>
          (a.displayOrder ?? 0) - (b.displayOrder ?? 0) ||
          a.name.localeCompare(b.name)
      )
    );

    return result;
  }, [items]);

  const totalDishes = groups.reduce((sum, g) => sum + g.items.length, 0);

  const scrollToCategory = (name: string) => {
    document
      .getElementById(slug(name))
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
          <p className="mb-3 text-sm text-red-500">{error}</p>

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
      {!loading && !error && groups.length === 0 && (
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

      {/* Dishes grouped by category */}
      {!loading && !error && groups.length > 0 && (
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            {totalDishes} {totalDishes === 1 ? "dish" : "dishes"} in{" "}
            {groups.length} {groups.length === 1 ? "category" : "categories"}
          </p>

          {/* Jump to category */}
          {groups.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {groups.map((group) => (
                <button
                  key={group.name}
                  type="button"
                  onClick={() => scrollToCategory(group.name)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {group.name}
                  <span className="ml-1.5 text-slate-400">
                    {group.items.length}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-10">
            {groups.map((group) => (
              <section
                key={group.name}
                id={slug(group.name)}
                aria-labelledby={`${slug(group.name)}-title`}
                className="scroll-mt-4"
              >
                {/* Category header */}
                <div className="mb-4 flex items-center gap-3">
                  <h2
                    id={`${slug(group.name)}-title`}
                    className="text-lg font-semibold text-slate-900 dark:text-slate-100"
                  >
                    {group.name}
                  </h2>

                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {group.items.length}{" "}
                    {group.items.length === 1 ? "dish" : "dishes"}
                  </span>

                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>

                {/* Dishes in this category */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      // Adjust this route to match your edit page.
                      onEdit={(dish) => navigate(`/menu-edit/${dish.id}`)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}