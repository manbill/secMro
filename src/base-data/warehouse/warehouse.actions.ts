import { Warehouse } from './warehouse.modal';
import { Action } from 'redux';
import { WarehouseState } from './warehouse.reducer';
export const FETCH_WAREHOUSE_DATA = 'fetch_warehouse_data';
export const FETCH_WAREHOUSE_COMPLETE = 'fetch_warehouse_complete';
export const INIT_WAREHOUSE_STATE = 'init_warehouse_state';
export const DO_REFRESH_WAREHOUSES='do_refresh_warehouses';
export const LOAD_MORE_WAREHOUSES='load_more_warehouses';
export const LOAD_MORE_WAREHOUSES_COMPLETED='load_more_warehouses_completed';
export const SELECT_WAREHOUSE='select_warehouse';
export function fetchWarehouse(): Action {
  return {
    type: FETCH_WAREHOUSE_DATA
  }
}
export interface InitWarehouseAction extends Action {
  state: WarehouseState
}
export function initWarehouse(warehouseState: WarehouseState): InitWarehouseAction {
  return {
    type: INIT_WAREHOUSE_STATE,
    state: warehouseState
  }
}
export interface FetchWarehouseCompleteAction extends Action {
  warehouses: Warehouse[];
}
export function fetchWarehouseComplete(warehouses: Warehouse[]): FetchWarehouseCompleteAction {
  return {
    type: FETCH_WAREHOUSE_COMPLETE,
    warehouses: warehouses
  }
}
