import { Action } from 'redux';
export const FETCH_MANUAL_FAULT_ORDER_DATA = 'fetch_manual_fault_order_data';
export const FETCH_MANUAL_FAULT_ORDER_DATA_COMPLETED = 'fetch_manual_fault_order_data_completed';
export const FETCH_SCADA_FAULT_ORDER_DATA = 'fetch_scada_fault_order_data';
export const FETCH_SCADA_FAULT_ORDER_DATA_COMPLETED = 'fetch_scada_fault_order_data_completed';
export const REFRESH_FAULT_ORDER_LIST='refresh_fault_order_list'
export function fetchManualFaultOrderData(): Action {
  return {
    type: FETCH_MANUAL_FAULT_ORDER_DATA
  }
}
export function fetchManualFaultOrderDataCompleted(): Action {
  return {
    type: FETCH_MANUAL_FAULT_ORDER_DATA_COMPLETED
  }
}
export function fetchSCADAFaultOrderData(): Action {
  return {
    type: FETCH_SCADA_FAULT_ORDER_DATA
  }
}
export function fetchSCADAFaultOrderDataCompleted(): Action {
  return {
    type: FETCH_SCADA_FAULT_ORDER_DATA_COMPLETED
  }
}
