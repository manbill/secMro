import { MaintenanceTaskState, MaintenanceTaskReducer } from './maintenance-task-order/maintenance-task.reducer';
import { Action,combineReducers } from 'redux';
export interface TaskWorkOrderState{
  maintenanceTaskState:MaintenanceTaskState
}
export const TaskWorkOrderReducer=combineReducers({
  maintenanceTaskState:MaintenanceTaskReducer
})
