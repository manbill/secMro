import { MaintenanceOrderState, MaintenanceOrderReducer } from './maintenance-orders/maintenance-order.reducer';
import { Action,combineReducers } from 'redux';
export interface PlannedWorkOrderState{
  maintenanceOrderReducer:MaintenanceOrderState
}
export const PlannedWorkOrderReducer=combineReducers({
  maintenanceOrderReducer:MaintenanceOrderReducer
})
