import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Shared Suspense wrapper for all lazy-loaded route components.
 *
 * Usage — in any feature's routes.tsx:
 *   const MyPage = React.lazy(() => import('./pages/MyPage'));
 *   element: <LazyRoute><MyPage /></LazyRoute>
 *
 * The spinner is centered inside the page content area (not the full
 * viewport), so the sidebar and top navigation remain stable while
 * the async chunk downloads.
 */
export function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      {children}
    </Suspense>
  );
}

function PageLoadingFallback() {
  return (
    <div
      className="flex flex-col items-center justify-center flex-1 h-full min-h-[400px] w-full"
      aria-label="Pagina wordt geladen"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <p className="text-sm font-medium text-gray-400 tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
}
