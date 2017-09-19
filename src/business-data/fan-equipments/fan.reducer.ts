import { FanMachine } from './fan.modal';
import { fetchMachinesEpic } from './fan.epics';
import { combineEpics } from 'redux-observable';
import { Action } from 'redux';
import * as FanMachineActions from "./fan.actions";
export interface FanMachineState  {

}
export function FanMachineReducer(state: FanMachineState = null, action: Action): FanMachineState {
  switch (action.type) {
    default:
      return {
        ...state
      }
    case FanMachineActions.FETCH_FAN_MACHINE_EQUIPMENTS_DATA_COMPLETED: {
      const machines = (<FanMachineActions.FetchFanMachineDataCompletedAction>action).machines;
      return {
        ...state,
        ids: machines.map(m => m.id),
        entities: machines.reduce((e, m) => { e[m.id] = m; return e; }, {}),
        hasMoreData: machines.length !== 0,
        loadMoreDataCompleted: true
      }
    }
  }
}
export const RootFanMachineEpic = combineEpics(fetchMachinesEpic);
