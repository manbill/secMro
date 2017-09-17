import {Action} from 'redux'
export const FETCH_WORK_ORDER_DATA='fetch_work_order_data';
export const FETCH_WORK_ORDER_DATA_COMPLETED='fetch_work_order_data_completed';
export function fetchWorkOrderData():Action{
  return {
    type:FETCH_WORK_ORDER_DATA
  }
}
export function fetchWorkOrderDataCompleted():Action{
  return {
    type:FETCH_WORK_ORDER_DATA_COMPLETED
  }
}
