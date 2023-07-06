import { SetterOrUpdater } from 'recoil';
import { IGbfsClient } from '../../interfaces/IGbfsClient'
import { GbfsRepoOptions } from '../../interfaces/IGbfsRepo'
import { System, SystemInformation, VehicleType } from '../../types';

export type RecoilGbfsRepoOptions = GbfsRepoOptions & { client: IGbfsClient }

export interface IGbfsSystemRepo {
  useSelectedSystemValue: () => System['system_id']
  useSetSelectedSystem: () => (id: System['system_id']) => void
  useSelectedSystemState: () => [
    System['system_id'],
    SetterOrUpdater<System['system_id']>
  ]
  useSystemValue: (id: System["system_id"]) => System
  useSystemsValue: () => System[]
  useSystemInformationValue: (id: System["system_id"]) => SystemInformation
  useSystemVehicleTypesValue: (id: System["system_id"]) => VehicleType[]
  // useSystemHours: () => {}[]
  // useSystemPricingPlans: () => {}[]
}

