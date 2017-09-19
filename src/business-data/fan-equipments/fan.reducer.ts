import { AppState } from './../../app/app.reducer';
import { FanMachine, FanMachineEquipmentDetails } from './fan.modal';
import { fetchMachinesEpic, getMachineDetailInfoEpic } from './fan.epics';
import { combineEpics } from 'redux-observable';
import { Action } from 'redux';
import * as FanMachineActions from "./fan.actions";
export interface FanMachineState {
  hasMoreData?: boolean;
  ids: number[];
  entities: {
    [id: number]: FanMachine;
  };
  loadMoreDataCompleted?: boolean;
  selectedFanMachineId: number;
  selectedFanMachineDetail: FanMachineEquipmentDetails;
  selectedDeviceEntity: {
    [deviceId: number]: string;
  };
};
const initState: FanMachineState = {
  hasMoreData: true,
  ids: [],
  entities: {},
  loadMoreDataCompleted: true,
  selectedFanMachineId: null,
  selectedFanMachineDetail: null,
  selectedDeviceEntity: null
}
export function FanMachineReducer(state: FanMachineState = initState, action: Action): FanMachineState {
  switch (action.type) {
    default:
      return {
        ...state
      }
    case FanMachineActions.GET_SELECTED_FAN_MACHINE_DETAIL_INFO_COMPLETED: {
      const detail = (<FanMachineActions.GetMachineDetailInfoCompletedAction>action).machineDetail;
      return {
        ...state,
        selectedFanMachineDetail: detail
      }
    }
    case FanMachineActions.AUTO_REFRESH_FAN_MACHINE_LIST_COMPLETED:
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
export function getMachineDetailInfo(state: AppState): FanMachineEquipmentDetails {
  return state.businessDataState.fanMachineState.selectedFanMachineDetail;
}
export function getMachinesFromState(state: AppState): FanMachine[] {
  return state.businessDataState.fanMachineState.ids.map(id => state.businessDataState.fanMachineState.entities[id]);
}
export const RootFanMachineEpic = combineEpics(fetchMachinesEpic, getMachineDetailInfoEpic);
