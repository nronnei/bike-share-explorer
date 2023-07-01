import React, { Suspense, useState } from "react";
import { Heading, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useInjection } from '../context/injection';
import { SystemDetails } from './SystemDetails';
import { SystemCard } from './systems-list/SystemCard';



function SystemsList({ onChangeSystem }: { onChangeSystem: () => void }) {
  const { systemService } = useInjection();
  const systems = systemService.getSystems();

  return <>
    <Heading as="h1" mb={8}>Systems</Heading>
    <VStack spacing={8} w='100%'>
      {systems.map((system) => (
        <SystemCard
          key={system.system_id}
          {...{ onChangeSystem, system }}
        />
      ))}
    </VStack>
  </>
}

export function SidebarContent() {
  const [viewFeed, setViewFeed] = useState(false);
  const toggleViewFeed = () => setViewFeed(!viewFeed);

  return <Suspense fallback={<Skeleton w='100%' h='100%' />}>
    {
      viewFeed
        ? <SystemDetails onBack={toggleViewFeed} />
        : <SystemsList onChangeSystem={toggleViewFeed} />
    }
  </Suspense>
}
