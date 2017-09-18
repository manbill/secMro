import { Action } from 'redux';
import { WorkOrder, ApiWorkorderBaseInfoDto } from '../work-order.modal';
import { BaseSearchParams } from '../../../common/mro.search-params.modal';
export const FETCH_FAULT_ORDER_DATA = 'fetch_fault_order_data';
export const FETCH_FAULT_ORDER_DATA_COMPLETED = 'fetch_scada_fault_order_data_completed';
export const MANUAL_REFRESH_FAULT_ORDER_LIST = 'manual_refresh_fault_order_list';
export const MANUAL_REFRESH_FAULT_ORDER_LIST_COMPLETED = 'manual_refresh_fault_order_list_completed';
export const AUTO_REFRESH_FAULT_ORDER_LIST = 'auto_refresh_fault_order_list';
export const AUTO_REFRESH_FAULT_ORDER_LIST_COMPLETED = 'auto_refresh_fault_order_list_completed';
export const UPDATE_SELECTED_FAULT_ORDER = 'update_selected_fault_order';
export const LOAD_MORE_FAULT_ORDER_DATA = 'load_more_fault_order_data';
export const LOAD_MORE_FAULT_ORDER_DATA_COMPLETED = 'load_more_fault_order_data_completed';
export interface FaultOrderSearchParams extends BaseSearchParams{
  searchParams:{
    workorderCode:string;
    workorderId:number;
    workorderIds:number[];
    faultCode:string;
    faultBegindate:number;
    workorderStatus:number;
    workorderType:string;
  }
}
export interface LoadMoreFaultOrderDataAction extends Action {
  searchParams:FaultOrderSearchParams
}
export function loadMoreFaultOrders(searchParams: FaultOrderSearchParams): LoadMoreFaultOrderDataAction {
  return {
    type: LOAD_MORE_FAULT_ORDER_DATA,
    searchParams: searchParams
  }
}
export interface LoadMoreFaultOrderDataCompletedAction extends Action {
  faultOrders: WorkOrder[];
}
export function loadMoreFaultOrdersCompleted(faultOrders: WorkOrder[]): LoadMoreFaultOrderDataCompletedAction {
  return {
    type: LOAD_MORE_FAULT_ORDER_DATA_COMPLETED,
    faultOrders: faultOrders
  }
}
export interface UpdateSelectedFaultOrderAction extends Action {
  faultOrder?: WorkOrder;
}
export function updateSelectedFaultOrder(faultOrder?: WorkOrder): UpdateSelectedFaultOrderAction {
  return {
    type: UPDATE_SELECTED_FAULT_ORDER,
    faultOrder: faultOrder
  }
}

export function fetchFaultOrderData(): Action {
  return {
    type: FETCH_FAULT_ORDER_DATA
  }
}
export function fetchFaultOrderDataCompleted(): Action {
  return {
    type: FETCH_FAULT_ORDER_DATA_COMPLETED
  }
}
export function manualRefreshFaultOrderList(): Action {
  return {
    type: MANUAL_REFRESH_FAULT_ORDER_LIST
  }
}
export function manualRefreshFaultOrderListCompleted(faultOrders:WorkOrder[]): RefreshFaultOrdeListCompletedAction {
  return {
    type: MANUAL_REFRESH_FAULT_ORDER_LIST_COMPLETED,
    faultOrders:faultOrders
  }
}
export interface AutoRefreshFaultOrderListAction extends Action {
  searchParams: {
    ids: number[]
  }
}
export function autoRefreshFaultOrderList(ids: number[]): AutoRefreshFaultOrderListAction {
  return {
    type: AUTO_REFRESH_FAULT_ORDER_LIST,
    searchParams: {
      ids: ids
    }
  }
}
export interface RefreshFaultOrdeListCompletedAction extends Action {
  faultOrders: WorkOrder[];
}
export function autoRefreshFaultOrdeListCompleted(faultOrders: WorkOrder[]): RefreshFaultOrdeListCompletedAction {
  return {
    type: AUTO_REFRESH_FAULT_ORDER_LIST_COMPLETED,
    faultOrders: faultOrders
  }
}
