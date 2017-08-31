import { fetchCompaniesEpic } from './../company/company.epics';
import { combineEpics } from 'redux-observable';
import { FETCH_WAREHOUSE_COMPLETE, FetchWarehouseCompleteAction } from './warehouse.actions';
import { Action } from 'redux';
import { Warehouse } from './warehouse.modal';
export function WarehouseReducer(state:WarehouseState=null,action:Action):WarehouseState{
  switch(action.type){
    default:{
      return state
    }
    case FETCH_WAREHOUSE_COMPLETE:{
      return {
        ...state,
        warehouses:(<FetchWarehouseCompleteAction>action).warehouses
      }
    }
  }
}
export interface WarehouseState{
  warehouses:Warehouse[];
}
export const RootWarehouseEpics=combineEpics(fetchCompaniesEpic);
