import { FETCH_WORK_ORDER_DATA_COMPLETED } from './../work-order.actions';
import { AppState, EpicDependencies } from './../../../app/app.reducer';
import { ActionsObservable } from 'redux-observable';
import { Store, Action } from 'redux';
import * as FaultOrderActions from './fault-order.actions'
export const fetchManualFaultOrderEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(FaultOrderActions.FETCH_MANUAL_FAULT_ORDER_DATA)
    .mapTo(FaultOrderActions.fetchManualFaultOrderDataCompleted());
}
export const fetchSCADAFaultOrderEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(FaultOrderActions.FETCH_SCADA_FAULT_ORDER_DATA)
    .mapTo(FaultOrderActions.fetchSCADAFaultOrderDataCompleted());
}
export const refreshFaultOrderListEpic=(action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies)=>{
  return action$.ofType(FETCH_WORK_ORDER_DATA_COMPLETED)
  .switchMap(()=>{
    return deps.db.executeSql(`select`);
  })
}
