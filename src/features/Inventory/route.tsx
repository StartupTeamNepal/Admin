import React from 'react';
import type { RouteObject } from 'react-router-dom';
// import { Outlet, Navigate } from 'react-router-dom';
import { LazyRoute } from '@/routes/LazyRoute';

const LazyIventoryHome = React.lazy(
  () => import('@/features/Inventory/pages/InventoryHome')
);


export const InventoryRoutes:RouteObject[]=[
    {
        path:'/inventory',
        element:(
            <LazyRoute>
                 <LazyIventoryHome/>
            </LazyRoute>
        )
    }
]