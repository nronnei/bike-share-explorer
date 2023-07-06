import React from 'react';
import { useRoutes } from 'react-router-dom';
import { SystemsView } from './systems';
import { SystemView } from './System';

export const AppRoutes = () => (
  useRoutes([
    {
      path: '/',
      element: <SystemsView />,
    },
    {
      path: '/systems/:systemId',
      children: [
        { index: true, element: <SystemView /> },
        // {
        //   path: 'stations',
        //   children: [
        //     { index: true, element: <SystemsView /> },
        //     {
        //       path: ':stationId',
        //       children: []
        //     },
        //   ]
        // },
      ]
    },
  ])
);
