import { WorkOrder } from './../../work-order.modal';
import { Action } from 'redux';
export const FETCH_MAINTENANCE_ORDERS = 'fetch_maintenance_orders';
export const FETCH_MAINTENANCE_ORDERS_COMPLETED = 'fetch_maintenance_orders_completed';
export interface fetchMaintenanceCompletedAction extends Action {
  orders: WorkOrder[]
}
export function fetchMaintenanceOrdersCompleted(orders: WorkOrder[]): fetchMaintenanceCompletedAction {
  return {
    type: FETCH_MAINTENANCE_ORDERS_COMPLETED,
    orders: orders
  }
}
export function fetchMaintenanceOrders(): Action {
  return {
    type: FETCH_MAINTENANCE_ORDERS
  }
}
