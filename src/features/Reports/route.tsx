import React from 'react';
import type { RouteObject } from 'react-router-dom';
// import { Outlet, Navigate } from 'react-router-dom';
import { LazyRoute } from '@/routes/LazyRoute';

const LazyReports= React.lazy(
  () => import('@/features/Reports/pages/Reportpage')
);


export const ReportRoutes:RouteObject[]=[
    {
        path:'/reports',
        element:(
            <LazyRoute>
                <LazyReports/>
            </LazyRoute>
        )
    }
]