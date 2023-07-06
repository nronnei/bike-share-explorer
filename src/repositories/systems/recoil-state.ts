import { DefaultValue, atom, selector, selectorFamily } from 'recoil';
import { NotFoundError } from '../../errors';
import { System } from '../../types';
import { RecoilGbfsRepoOptions } from './interface';

const logTag = 'RecoilGbfsRepo::';

export function createSystemsState({ client, logger }: RecoilGbfsRepoOptions) {

  const getAllSystems = selector({
    key: 'getAllSystems',
    get: async () => {
      const systems = await client.getSystems();
      // GBFS System IDs don't need to be random 🙃 we're gonna fix that.
      systems.forEach((s, i) => s.system_id = i.toString());
      // systems.forEach((s, i) => s.system_id = window.crypto.randomUUID());
      return systems;
    }
  });

  const selectedSystemId = atom({
    key: 'selectedSystemId',
    default: (() => {
      try {
        return client.getSystem().system_id;
      } catch (error) {
        if (error instanceof NotFoundError) {
          logger.warn(`${logTag}selectedSystemDefault: no system found`);
          return '';
        }
        throw error;
      }
    })(),
  });

  const selectedSystem = selector({
    key: 'selectedSystem',
    get: async ({ get }) => await get(selectedSystemId),
    set: async ({ get, set }, newId) => {
      if (!(newId instanceof DefaultValue)) {
        const systems = await get(getAllSystems);
        const newSystem = systems.find(s => s.system_id === newId);
        if (!newSystem) throw new NotFoundError(`System ${newId} is not available.`);
        await client.loadSystemData(newSystem);
        set(selectedSystemId, newId);
      }
    }
  });

  const availableSystemsIdx = selector({
    key: 'availableSystemsIdx',
    get: async ({ get }) => {
      const systems = await get(getAllSystems);
      return systems.map(s => s.system_id);
    }
  });

  const availableSystems = selectorFamily({
    key: 'availableSystems',
    get: (id: string) => async ({ get }) => {
      const systems = await get(getAllSystems);
      const target = systems.find(s => s.system_id === id);
      if (!target) {
        const message = `Couldn't find system "${id}".`
        logger.debug(`${logTag}availableSystems: ${message}`);
        throw new NotFoundError(message);
      }
      return target;
    }
  });

  const systemInformation = selectorFamily({
    key: 'systemInformation',
    get: (id: System["system_id"]) => async ({ get }) => {
      // here to listen for changes
      const selectedId = await get(selectedSystemId);
      if (id !== selectedId) {
        const newSystem = (await get(getAllSystems)).find(s => s.system_id === id)
        await client.loadSystemData(newSystem)
      }
      const systemInfo = await client.getSystemInformation();
      return systemInfo.data;
    }
  })

  const systemLanguages = selectorFamily({
    key: 'systemLanguages',
    get: (id: System["system_id"]) => async () => {
      const feeds = await client.getAutoDiscovery();
      return Object.keys(feeds.data);
    }
  });

  const systemVehicleTypes = selectorFamily({
    key: 'systemVehicleTypes',
    get: (id: System["system_id"]) => async () => {
      const vehicleTpes = await client.getSystemVehicleTypes();
      return vehicleTpes.data.vehicle_types;
    }
  });

  return {
    getAllSystems,
    selectedSystem,
    availableSystemsIdx,
    availableSystems,
    systemInformation,
    systemLanguages,
    systemVehicleTypes,
  };
}
