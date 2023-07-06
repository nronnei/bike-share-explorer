import React, { useEffect } from 'react';
import { Heading, Text, Button, VStack, Box } from '@chakra-ui/react';
import { useInjection } from '../context/injection';
import { useNavigate, useParams } from 'react-router-dom';
import { System } from '../types';

// type SystemDetailsProps = {
//   system: System,
// }
function SystemDetails() {
  const { systemService } = useInjection();
  const { systemId = '' } = useParams();
  const system = systemService.useSystem(systemId);
  const info = systemService.useSystemInfo(system.system_id);

  return (
    <VStack alignItems="left">
      <Heading as="h1" size="xl" noOfLines={2}>{info.name}</Heading>
      <Heading as="h2" size="lg">Details</Heading>
      <Text>Location: {system.location}</Text>
      <Text>Language: {info.language ?? 'Unknown'}</Text>
      <Text>Operator: {info.operator ?? 'Unknown'}</Text>
      <Text>Timezone: {info.timezone ?? 'Unknown'}</Text>
    </VStack>
  )
}

type StationDetailsProps = {
  system?: System,
}
function StationDetails({ system }: StationDetailsProps) {
  const { stationService } = useInjection();
  const navigate = useNavigate();
  const stations = stationService.useAllStations();
  return (
    <VStack>
      <Heading as="h2" size="lg">Stations</Heading>
      <Text> The system contains {stations.length} stations. The first one is below.</Text>
      <pre>
        {JSON.stringify(stations[0], null, 2)}
      </pre>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </VStack>
  )
}

export function SystemView() {

  const { systemService } = useInjection();
  const { systemId = '' } = useParams();

  systemService.useSetSelectedSystemState(systemId);
  const system = systemService.useSystem(systemId);
  const loadSystem = systemService.useLoadSystem();
  loadSystem(system);


  const stations = [{}];
  // const stations = stationService.useAllStations();

  return (
    <VStack alignItems="left">
      <SystemDetails />
      <StationDetails />
    </VStack>
  )
}
