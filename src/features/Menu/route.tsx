import React from 'react';
import type { RouteObject } from 'react-router-dom';
// import { Outlet, Navigate } from 'react-router-dom';
import { LazyRoute } from '@/routes/LazyRoute';

const LazyMenu = React.lazy(
  () => import('@/features/Menu/pages/Menupage')
);


export const MenuRoutes:RouteObject[]=[
    {
        path:'/menu',
        element:(
            <LazyRoute>
                <LazyMenu/>
             </LazyRoute>
        )
    }
]