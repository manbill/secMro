import { fetchWorkOrderEpics } from './work-order.epics';
import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import { PlannedWorkOrderState, PlannedWorkOrderReducer } from './planned-work-order/planned-work-order.reducer';
import { WorkOrder } from "./work-order.modal";
import { FaultOrderState, FaultOrderReducer, RootFaultOrderEpics } from './fault-order/fault-order.reducer';
export interface WorkOrderState {
  plannedWorkOrderState: PlannedWorkOrderState;
  faultOrderState: FaultOrderState
}
export const WorkOrderStateReducer = combineReducers({
  plannedWorkOrderState: PlannedWorkOrderReducer,
  faultOrderState: FaultOrderReducer
});
export const RootWorkOrderEpics = combineEpics(fetchWorkOrderEpics, RootFaultOrderEpics);
export interface IBusinessDataBaseState {
  hasMoreData: boolean;
  loadMoreDataCompleted: boolean;
  refreshCompleted: boolean;
  selectedWorkOrderId: number;
  ids: number[];
  entities: {
    [id: number]: WorkOrder
  }
}
