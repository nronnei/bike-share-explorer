import React, { Suspense } from 'react';
import { useInjection } from '../context/injection';
import { Heading, Skeleton, VStack } from '@chakra-ui/react';
import { SystemCard } from '../components/systems-list/SystemCard';
import { useNavigate } from 'react-router-dom';
import { System } from '../types';

export const SystemsView = () => {
  const { systemService } = useInjection();
  const systems = systemService.getSystems();
  const navigate = useNavigate();
  const onChangeSystem = async (system: System) => {
    const { system_id: systemId } = system;
    navigate(`/systems/${systemId}`);
  };

  return (
    <>
      <Heading as="h1" mb={8}>Systems</Heading>
      <VStack spacing={8} w='100%'>
        {systems.map((system) => (
          <SystemCard
            key={system.system_id}
            {...{ onSetSystem: onChangeSystem, system }}
          />
        ))}
      </VStack>
    </>
  )
}
