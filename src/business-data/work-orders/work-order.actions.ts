import {Action} from 'redux'
export const FETCH_WORK_ORDER_DATA='fetch_work_order_data';
export function fetchWorkOrderData():Action{
  return {
    type:FETCH_WORK_ORDER_DATA
  }
}