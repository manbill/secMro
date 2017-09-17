import { fetchManualFaultOrderEpic, fetchSCADAFaultOrderEpic } from './fault-order.epics';
import { combineEpics } from 'redux-observable';
import { Action } from 'redux';
import { IBusinessDataBaseState } from './../work-orders.reducer';
import { WorkOrder } from "../work-order.modal";

export interface FaultOrderState extends IBusinessDataBaseState {

}
export function FaultOrderReducer(state: FaultOrderState = null, action: Action): FaultOrderState {
  switch (action.type) {
    default: {
      return {
        ...state
      }
    }
  }
}
export const RootFaultOrderEpics=combineEpics(fetchManualFaultOrderEpic,fetchSCADAFaultOrderEpic);
