import React from 'react';
import type { RouteObject } from 'react-router-dom';
// import { Outlet, Navigate } from 'react-router-dom';
import { LazyRoute } from '@/routes/LazyRoute';

const LazyProfile= React.lazy(
  () => import('@/features/Profile/pages/Profilepage')
);


export const ProfileRoutes:RouteObject[]=[
    {
        path:'/profile',
        element:(
            <LazyRoute>
                <LazyProfile/>
            </LazyRoute>
        )
    }
]