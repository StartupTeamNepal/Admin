import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet, Navigate } from 'react-router-dom';
import { LazyRoute } from '@/routes/LazyRoute';

const LazyRestaurantTable = React.lazy(
  () => import('@/features/Table/pages/RestaurantTablePage')
);


export const RestaurantTableRoutes:RouteObject[]=[
    {
        path:'/manage-table',
        element:(
            <LazyRoute>
                <LazyRestaurantTable/>
            </LazyRoute>
        )
    }
]