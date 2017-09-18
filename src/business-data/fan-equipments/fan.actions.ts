import { FanMachine } from './fan.modal';
import { Action } from 'redux';
export const FETCH_FAN_MACHINE_EQUIPMENTS_DATA = 'fetch_fan_machine_equipments_data';
export const FETCH_FAN_MACHINE_EQUIPMENTS_DATA_COMPLETED = 'fetch_fan_machine_equipments_data_completed';
export function fetchFanMachineData(): Action {
  return {
    type: FETCH_FAN_MACHINE_EQUIPMENTS_DATA
  }
}
export interface FetchFanMachineDataCompletedAction extends Action {
  machines: FanMachine[];
}
export function fetchFanMachineDataCompleted(machines: FanMachine[]): FetchFanMachineDataCompletedAction {
  return {
    type: FETCH_FAN_MACHINE_EQUIPMENTS_DATA_COMPLETED,
    machines: machines
  }
}
