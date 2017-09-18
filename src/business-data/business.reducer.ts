import { RootFanMachineEpic, FanMachineState, FanMachineReducer } from './fan-equipments/fan.reducer';
import { combineEpics } from 'redux-observable';
import { Action, combineReducers } from 'redux';
import { WorkOrderState, WorkOrderStateReducer, RootWorkOrderEpics } from './work-orders/work-orders.reducer';
export interface BusinessDataState {
  workOrderState: WorkOrderState;//定维、技改、安装调试任务单和计划通知单,
  fanMachineState: FanMachineState;
}
export const BusinessDataReducer = combineReducers({
  workOrderState: WorkOrderStateReducer,
  fanMachineState: FanMachineReducer
})
export const RootBusinessEpics = combineEpics(RootWorkOrderEpics, RootFanMachineEpic);
