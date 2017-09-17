import { Action } from 'redux';
export const FETCH_MAINTENANCE_TASK_DATA = 'fetch_maintenance_task_data';
export const FETCH_MAINTENANCE_TASK_DATA_COMPLETED = 'fetch_maintenance_task_data_completed';
export function fetchMaintenanceTaskOrders(): Action {
  return {
    type: FETCH_MAINTENANCE_TASK_DATA
  }
}
export function fetchMaintenanceTaskOrdersCompleted(): Action {
  return {
    type: FETCH_MAINTENANCE_TASK_DATA_COMPLETED
  }
}
