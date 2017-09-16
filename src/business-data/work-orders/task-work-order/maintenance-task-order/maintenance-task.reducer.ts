import { BaseDataState } from './../../../../base-data/base-data.reducer';
import { WorkOrder, BaseOrderList } from './../../work-order.modal';
import { Action } from 'redux';
export interface MaintenanceOrderEntities{
  [id:number]:WorkOrder;
}
export interface MaintenanceTaskState extends BaseOrderList{
  ids:number[];
  maintenanceOrderentities:MaintenanceOrderEntities;
  selectedOrderId:number;
}
export function MaintenanceTaskReducer(state: MaintenanceTaskState, action: Action): MaintenanceTaskState {
  switch (action.type) {
    default: {
      return {
        ...state
      }
    }
  }
}
