import React from 'react';
import type { RouteObject } from 'react-router-dom';
// import { Outlet, Navigate } from 'react-router-dom';
import { LazyRoute } from '@/routes/LazyRoute';

const LazyStaff = React.lazy(
  () => import('@/features/Staff/pages/Staffpage')
);


export const StaffRoutes:RouteObject[]=[
    {
        path:'/staff',
        element:(
            <LazyRoute>
                <LazyStaff/>
            </LazyRoute>
        )
    }
]