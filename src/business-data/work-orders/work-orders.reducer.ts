import { fetchWorkOrderEpics } from './work-order.epics';
import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import { PlannedWorkOrderState,PlannedWorkOrderReducer } from './planned-work-order/planned-work-order.reducer';
import { TaskWorkOrderState,TaskWorkOrderReducer } from './task-work-order/task-work-order.reducer';
import { WorkOrder } from "./work-order.modal";
export interface WorkOrderState{
  plannedWorkOrderState:PlannedWorkOrderState;
  taskWorkOrderState:TaskWorkOrderState;
}
export const WorkOrderStateReducer=combineReducers({
  plannedWorkOrderState:PlannedWorkOrderReducer,
  taskWorkOrderState:TaskWorkOrderReducer
});
export const RootWorkOrderEpics = combineEpics(fetchWorkOrderEpics);
