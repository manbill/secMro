import { combineEpics } from 'redux-observable';
import { FETCH_WAREHOUSE_COMPLETE, FetchWarehouseCompleteAction, INIT_WAREHOUSE_STATE, InitWarehouseAction } from './warehouse.actions';
import { Action } from 'redux';
import { Warehouse } from './warehouse.modal';
import { fetchWarehouseEpic } from './warehouse.epics';
import { IBaseDataState } from '../base-data.reducer';
export function WarehouseReducer(state: WarehouseState = {
  ids: [],
  isCompleted: false,
  warehouseEntities: {}
}, action: Action): WarehouseState {
  switch (action.type) {
    default: {
      return state
    }
    case INIT_WAREHOUSE_STATE: {
      return (<InitWarehouseAction>action).state;
    }
    case FETCH_WAREHOUSE_COMPLETE: {
      const warehousees = (<FetchWarehouseCompleteAction>action).warehouses;
      return {
        ...state,
        isCompleted:true,
        ids: warehousees.map(warehouse => warehouse.repertoryId),
        warehouseEntities: warehousees.reduce((entities, warehouse) => {
          entities[warehouse.repertoryId] = warehouse;
          return entities;
        }, {})
      }
    }
  }
}
export interface WarehouseEntities {
  [id: number]: Warehouse
}
export interface WarehouseState extends IBaseDataState{
  warehouseEntities: WarehouseEntities;
  ids: number[],
}
export const RootWarehouseEpics = combineEpics(fetchWarehouseEpic);
