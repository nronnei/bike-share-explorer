import { useEffect } from 'react';
import { useInjection } from '../context/injection';

export function useStationClick() {
  const { mapService } = useInjection();

  useEffect(() => {
    const listener = mapService.on('click', async ({ lng, lat, libEvent }) => {
      const features = await mapService.queryFeatures([lng, lat]);
      console.log(features);
    });
    return listener;
  });
}
