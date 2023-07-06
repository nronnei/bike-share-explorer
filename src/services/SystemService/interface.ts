import { SetterOrUpdater } from 'recoil'
import { System, SystemInformation, VehicleType } from '../../types'

export interface ISystemService {
  useSelectedSytemState: () => [
    System['system_id'],
    SetterOrUpdater<System['system_id']>
  ],
  getSystems: () => System[],
  useSelectedSystem: () => System['system_id'],
  useSetSelectedSystemState: (id: System['system_id']) => void,
  useSystem: (id: System["system_id"]) => System,
  useLoadSystem: () => (system?: System) => Promise<void>
  useSystemInfo: (id: System["system_id"]) => SystemInformation,
  useSystemVehicleTypes: (id: System["system_id"]) => VehicleType[],
}
