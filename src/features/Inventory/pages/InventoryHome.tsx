import React from 'react';
import CriticalIngredientsTable from '../components/CriticalItems';
import IngredientQuantityTable from '../components/CurrentIngredients';
import { AlertTriangle, Boxes } from 'lucide-react';

export default function InventoryDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
  <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
    
            {/* Page Header */}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Kitchen Inventory Management
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Monitor current ingredient levels and critical stock thresholds in real-time.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
              
              {/* Critical Items */}
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl shadow-sm min-w-0">
                <AlertTriangle className="w-8 h-8 shrink-0 text-amber-500 p-1.5 bg-amber-50 dark:bg-amber-950/50 rounded-lg" />

                <div className="min-w-0">
                  <div className="text-xs text-slate-500 font-medium">
                    Critical Items
                  </div>

                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    4 Low Stock
                  </div>
                </div>
              </div>

              {/* Total Tracked */}
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl shadow-sm min-w-0">
                <Boxes className="w-8 h-8 shrink-0 text-blue-500 p-1.5 bg-blue-50 dark:bg-blue-950/50 rounded-lg" />

                <div className="min-w-0">
                  <div className="text-xs text-slate-500 font-medium">
                    Total Tracked
                  </div>

                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    7 Ingredients
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 gap-8">
          {/* Top Section: Critical Ingredients Needing Attention */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CriticalIngredientsTable />
          </section>

          {/* Bottom Section: General Stock Quantities */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <IngredientQuantityTable />
          </section>
        </div>
      </div>
    </div>
  );
}