// import L from "leaflet";
import "leaflet/dist/leaflet.css"
import React, { useRef, useEffect } from "react";
import { Box } from '@chakra-ui/react'
import { useMapEventListeners } from '../hooks/use-map-event-listeners';
import { useInjection } from '../context/injection';
import { useStationClick } from '../hooks/use-station-click';

export const Map = () => {

  const { mapService } = useInjection();
  const CONTAINER_ID = 'map-container';
  const mapRef = useRef(CONTAINER_ID);
  const mapLoaded = useRef(false);

  const { setMapEventListeners, removeMapEventListeners } = useMapEventListeners(mapService);

  useEffect(() => {
    if (!mapLoaded.current) {
      mapService.setMap(mapRef.current);
      setMapEventListeners();
      mapLoaded.current = true;
    }
    return removeMapEventListeners;
  }, [mapLoaded])

  useStationClick();


  return <Box w="100%" h="100vh" bg="yellow" id={CONTAINER_ID}></Box>
}
