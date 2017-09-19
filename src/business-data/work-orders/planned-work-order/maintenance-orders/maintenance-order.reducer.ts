import { IBusinessWorkOrderDataBaseState } from './../../work-orders.reducer';
import { AppState } from './../../../../app/app.reducer';
import { Action } from 'redux';
import { WorkOrder } from '../../work-order.modal';
export interface MaintenanceOrderState extends IBusinessWorkOrderDataBaseState{

}
export function MaintenanceOrderReducer(state: MaintenanceOrderState = null, action: Action): MaintenanceOrderState {
  switch (action.type) {
    default: {
      return {
        ...state
      }
    }
  }
}
