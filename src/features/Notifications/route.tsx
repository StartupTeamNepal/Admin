import React from 'react';
import type { RouteObject } from 'react-router-dom';
// import { Outlet, Navigate } from 'react-router-dom';
import { LazyRoute } from '@/routes/LazyRoute';
import Notificationpage from '@/features/Notifications/pages/Notificationpage';

const LazyNotification = React.lazy(
  () => import('@/features/Notifications/pages/Notificationpage')
);


export const NotificationRoutes:RouteObject[]=[
    {
        path:'/notifications',
        element:(
            <LazyRoute>
                <Notificationpage/>
            </LazyRoute>
        )
    }
]