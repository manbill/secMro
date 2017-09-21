import { BaseSearchParams } from './../../common/mro.search-params.modal';
import { FanMachine, FanMachineEquipmentDetails, DeviceTree } from './fan.modal';
import { Action } from 'redux';
export const REFRESH_FAN_MACHINE_LIST = 'refresh_fan_machine_list';
export const REFRESH_FAN_MACHINE_LIST_COMPLETED = 'refresh_fan_machine_list_completed';
export const LOAD_MORE_MACHINE_DATA = 'LOAD_MORE_MACHINE_DATA';
export const LOAD_MORE_MACHINE_DATA_COMPLETED = 'load_more_machine_data_completed';
export const FETCH_FAN_MACHINE_EQUIPMENTS_DATA = 'fetch_fan_machine_equipments_data';
export const FETCH_FAN_MACHINE_EQUIPMENTS_DATA_COMPLETED = 'fetch_fan_machine_equipments_data_completed';
export const GET_SELECTED_MACHINE_EQUIPMENT_DETAILS = 'get_selected_machine_equipment_details';
export const GET_SELECTED_MACHINE_EQUIPMENT_DETAILS_COMPLETED = 'get_selected_machine_equipment_details_completed';
export const SELECT_MACHINE = 'select_machine';
export const SELECT_DEVICE_EQUIPMENT = 'select_device_equipment';
export interface SelectMachineAction extends Action {
  machine: FanMachine;
}
export function selectMachine(machine: FanMachine): SelectMachineAction {
  return {
    type: SELECT_MACHINE,
    machine: machine
  }
}
export function selectDeviceEquipment(machine: FanMachine): SelectMachineAction {
  return {
    type: SELECT_DEVICE_EQUIPMENT,
    machine
  }
}
export function refreshMachineList(): Action {
  return {
    type: REFRESH_FAN_MACHINE_LIST
  }
}
export function refreshMachineListCompleted(): Action {
  return {
    type: REFRESH_FAN_MACHINE_LIST_COMPLETED,
  }
}
export interface MachineSearchParams extends BaseSearchParams {
  positionCode: null;//机位号
  machineId: null;//风机ID
  ids?: number[];//根据id查询,通过这个参数，判断是否是自动刷新还是手动刷新
}
export interface LoadMoreMachineDataAction extends Action {
  searchParams: MachineSearchParams
}
export function loadMoreFanMachineData(searchParams: MachineSearchParams): LoadMoreMachineDataAction {
  return {
    type: LOAD_MORE_MACHINE_DATA,
    searchParams: searchParams
  }
}
export function loadMoreFanMachineDataCompleted(machines: FanMachine[]): FetchFanMachineDataCompletedAction {
  return {
    type: LOAD_MORE_MACHINE_DATA_COMPLETED,
    machines: machines
  }
}
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
export function getFanMachineEquipmentDetails(): Action {
  return {
    type: GET_SELECTED_MACHINE_EQUIPMENT_DETAILS
  }
}
export interface GetSelectedMachineEquipmentDetailsAction extends Action {
  fanDetail: FanMachineEquipmentDetails;
}
export function getFanMachineEquipmentDetailsCompleted(fanDetail: FanMachineEquipmentDetails): GetSelectedMachineEquipmentDetailsAction {
  return {
    type: GET_SELECTED_MACHINE_EQUIPMENT_DETAILS_COMPLETED,
    fanDetail: fanDetail
  }
}
