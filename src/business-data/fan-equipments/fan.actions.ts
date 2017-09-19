import { BaseSearchParams } from './../../common/mro.search-params.modal';
import { FanMachine, FanMachineEquipmentDetails } from './fan.modal';
import { Action } from 'redux';
export const MANUAL_REFRESH_FAN_MACHINE_LIST = 'manual_refresh_fan_machine_list';
export const AUTO_REFRESH_FAN_MACHINE_LIST = 'auto_refresh_fan_machine_list';
export const AUTO_REFRESH_FAN_MACHINE_LIST_COMPLETED = 'auto_refresh_fan_machine_list_completed';
export const MANUAL_REFRESH_FAN_MACHINE_LIST_COMPLETED = 'manual_refresh_fan_machine_list_completed';
export const LOAD_MORE_MACHINE_DATA = 'LOAD_MORE_MACHINE_DATA';
export const LOAD_MORE_MACHINE_DATA_COMPLETED = 'load_more_machine_data_completed';
export const FETCH_FAN_MACHINE_EQUIPMENTS_DATA = 'fetch_fan_machine_equipments_data';
export const FETCH_FAN_MACHINE_EQUIPMENTS_DATA_COMPLETED = 'fetch_fan_machine_equipments_data_completed';
export const GET_SELECTED_FAN_MACHINE_DETAIL_INFO = 'get_selected_fan_machine_detail_info';
export const GET_SELECTED_FAN_MACHINE_DETAIL_INFO_COMPLETED = 'get_selected_fan_machine_detail_info_completed';
export function manualRefreshMachineList(): Action {
  return {
    type: MANUAL_REFRESH_FAN_MACHINE_LIST
  }
}
export function autoRefreshMachineList(): Action {
  return {
    type: AUTO_REFRESH_FAN_MACHINE_LIST
  }
}
export function autoRefreshMachineListCompleted(machines: FanMachine[]): FetchFanMachineDataCompletedAction {
  return {
    type: AUTO_REFRESH_FAN_MACHINE_LIST_COMPLETED,
    machines: machines
  }
}
export function manualRefreshMachineDataCompleted(): Action {
  return {
    type: MANUAL_REFRESH_FAN_MACHINE_LIST_COMPLETED
  }
}
export interface MachineSearchParams extends BaseSearchParams {
  positionCode: null,//机位号
  machineId: null,//风机ID
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
    type: FETCH_FAN_MACHINE_EQUIPMENTS_DATA_COMPLETED,
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
export function getMachineDetailInfo(): Action {
  return {
    type: GET_SELECTED_FAN_MACHINE_DETAIL_INFO
  }
}
export interface GetMachineDetailInfoCompletedAction extends Action {
  machineDetail: FanMachineEquipmentDetails;
}
export function getMachineDetailInfoCompleted(machineDetail: FanMachineEquipmentDetails): GetMachineDetailInfoCompletedAction {
  return {
    type: GET_SELECTED_FAN_MACHINE_DETAIL_INFO_COMPLETED,
    machineDetail: machineDetail
  }
}
