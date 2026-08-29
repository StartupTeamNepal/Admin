import React from 'react';
import type { RouteObject } from 'react-router-dom';
// import { Outlet, Navigate } from 'react-router-dom';
import { LazyRoute } from '@/routes/LazyRoute';

const LazyBilling = React.lazy(
  () => import('@/features/Billing/pages/Billingpage')
);


export const BillingRoutes:RouteObject[]=[
    {
        path:'/billing',
        element:(
            <LazyRoute>
                <LazyBilling/>
             </LazyRoute>
        )
    }
]