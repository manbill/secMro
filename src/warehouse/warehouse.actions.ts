import { Warehouse } from './warehouse.modal';
import { Action } from 'redux';
export const FETCH_WAREHOUSE='fetch_warehouse';
export const FETCH_WAREHOUSE_COMPLETE='fetch_warehouse_complete';
export function fetchWarehouse():Action{
  return {
    type:FETCH_WAREHOUSE
  }
}
export interface FetchWarehouseCompleteAction extends Action{
  warehouses:Warehouse[];
}
export function fetchWarehouseComplete(warehouses:Warehouse[]):FetchWarehouseCompleteAction{
  return {
    type:FETCH_WAREHOUSE_COMPLETE,
    warehouses:warehouses
  }
}
