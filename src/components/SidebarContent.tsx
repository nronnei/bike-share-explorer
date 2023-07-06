import React, { Suspense, useState } from "react";
import { AppRoutes } from '../views';
import { Skeleton } from '@chakra-ui/react';

export function SidebarContent() {
  return (
    <Suspense fallback={<Skeleton w='100%' h='100%' />}>
      <AppRoutes />
    </Suspense>
  )
}
