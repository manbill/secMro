import { LOAD_MORE_FAULT_ORDER_DATA } from './../work-orders/fault-order/fault-order.actions';
import { AppState } from './../../app/app.reducer';
import { FanMachine, FanMachineEquipmentDetails, DeviceTree } from './fan.modal';
import { fetchMachinesEpic, selectMachineEpic, getMachineFanDetailsEpic, loadMoreMachinesEpic, manualRefreshMachineListEpic } from './fan.epics';
import { combineEpics } from 'redux-observable';
import { Action } from 'redux';
import * as FanMachineActions from "./fan.actions";
export interface FanMachineState {
  hasMoreData?: boolean;
  ids: number[];
  entities: {
    [id: number]: FanMachine;
  };
  refreshDataCompleted: boolean;
  loadMoreDataCompleted: boolean;
  selectedFanMachineId: number;
  selectedFanMachineEquipmentDetails: FanMachineEquipmentDetails;
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
  selectedFanMachineEquipmentDetails: null,
  selectedDeviceEntity: null,
  refreshDataCompleted: true
}
export function FanMachineReducer(state: FanMachineState = initState, action: Action): FanMachineState {
  switch (action.type) {
    default:
      return {
        ...state
      }
    case FanMachineActions.GET_SELECTED_MACHINE_EQUIPMENT_DETAILS_COMPLETED: {
      const fanDetail = (<FanMachineActions.GetSelectedMachineEquipmentDetailsAction>action).fanDetail;
      return {
        ...state,
        selectedFanMachineEquipmentDetails: fanDetail
      }
    }
    case FanMachineActions.AUTO_REFRESH_FAN_MACHINE_LIST:
    case FanMachineActions.MANUAL_REFRESH_FAN_MACHINE_LIST: {
      return {
        ...state,
        ...initState,
        refreshDataCompleted: false
      }
    }
    case FanMachineActions.LOAD_MORE_MACHINE_DATA: {
      return {
        ...state,
        loadMoreDataCompleted: false
      }
    }
    case FanMachineActions.SELECT_MACHINE: {
      const machine = (<FanMachineActions.SelectMachineAction>action).machine;
      return {
        ...state,
        selectedDeviceEntity: null,
        selectedFanMachineId: machine.id,
        selectedFanMachineEquipmentDetails: null,
      }
    }
    case FanMachineActions.GET_SELECTED_MACHINE_EQUIPMENT_DETAILS: {
      return {
        ...state,
        selectedFanMachineEquipmentDetails: null
      }
    }
    case FanMachineActions.GET_SELECTED_MACHINE_EQUIPMENT_DETAILS_COMPLETED: {
      return {
        ...state,
        selectedFanMachineEquipmentDetails: (<FanMachineActions.GetSelectedMachineEquipmentDetailsAction>action).fanDetail
      }
    }
    case FanMachineActions.LOAD_MORE_MACHINE_DATA_COMPLETED: {
      const machines = (<FanMachineActions.FetchFanMachineDataCompletedAction>action).machines;
      return {
        ...state,
        loadMoreDataCompleted: true,
        ids: state.ids.concat(machines.map((m) => m.id)),
        entities: Object.assign({}, state.entities, machines.reduce((e, m) => { e[m.id] = m; return e }, {})),
        hasMoreData: machines.length !== 0
      }
    }
    case FanMachineActions.MANUAL_REFRESH_FAN_MACHINE_LIST_COMPLETED:
    case FanMachineActions.FETCH_FAN_MACHINE_EQUIPMENTS_DATA_COMPLETED:
    case FanMachineActions.AUTO_REFRESH_FAN_MACHINE_LIST_COMPLETED: {
      const machines = (<FanMachineActions.FetchFanMachineDataCompletedAction>action).machines;
      return {
        ...state,
        ids: machines.map(m => m.id),
        entities: machines.reduce((e, m) => { e[m.id] = m; return e; }, {}),
        hasMoreData: machines.length !== 0,
        loadMoreDataCompleted: true,
        refreshDataCompleted: true
      }
    }
  }
}
export function getSelectedFanDetail(state: AppState): FanMachineEquipmentDetails {
  return state.businessDataState.fanMachineState.selectedFanMachineEquipmentDetails;
}
export function getSelectedMachine(state: AppState): FanMachine {
  return state.businessDataState.fanMachineState.entities[state.businessDataState.fanMachineState.selectedFanMachineId];
}
export function getMachines(state: AppState): FanMachine[] {
  return state.businessDataState.fanMachineState.ids.map(id => state.businessDataState.fanMachineState.entities[id]);
}
export const RootFanMachineEpic = combineEpics(fetchMachinesEpic, manualRefreshMachineListEpic, selectMachineEpic, getMachineFanDetailsEpic, loadMoreMachinesEpic);
