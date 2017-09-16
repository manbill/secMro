import { WorkOrder } from './work-order.modal';
import { Action } from 'redux';
export const FETCH_WORK_ORDERS = 'fetch_work_orders';
export const FETCH_WORK_ORDERS_COMPLETED = 'fetch_work_orders_completed';
export function fetchWorkorders(): Action {
  return {
    type: FETCH_WORK_ORDERS
  }
}
export function fetchWorkordersCompleted(): Action {
  return {
    type: FETCH_WORK_ORDERS_COMPLETED
  }
}
