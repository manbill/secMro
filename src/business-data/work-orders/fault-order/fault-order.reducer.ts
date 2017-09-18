import { combineEpics } from 'redux-observable';
import { Action } from 'redux';
import { IBusinessDataBaseState } from './../work-orders.reducer';
import { WorkOrder } from '../work-order.modal';
import * as FaultOrderActions from "./fault-order.actions";
import { manualRefreshFaultOrderListEpic, autoRefreshFaultOrderListEpic, updateSelectedFaultOrderEpic, loadMoreFaultOrdersEpic } from './fault-order.epics';
import { LOAD_MORE_FAULT_ORDER_DATA, LOAD_MORE_FAULT_ORDER_DATA_COMPLETED } from './fault-order.actions';
import { AppState } from '../../../app/app.reducer';
export interface FaultOrderState extends IBusinessDataBaseState {

}
const initState: FaultOrderState = {
  ids: [],
  entities: {},
  hasMoreData: true,
  loadMoreDataCompleted: false,
  refreshCompleted: false,
  selectedWorkOrderId: null
}
export function FaultOrderReducer(state: FaultOrderState = initState, action: Action): FaultOrderState {
  switch (action.type) {
    default: {
      return {
        ...state
      }
    }
    case FaultOrderActions.LOAD_MORE_FAULT_ORDER_DATA: {
      return {
        ...state,
        loadMoreDataCompleted: false
      }
    }
    case FaultOrderActions.LOAD_MORE_FAULT_ORDER_DATA_COMPLETED: {
      const faultOrders = (<FaultOrderActions.LoadMoreFaultOrderDataCompletedAction>action).faultOrders;
      return {
        ...state,
        ids: state.ids.concat(faultOrders.map(order => order.apiWorkorderBaseInfoDto.workorderId)),
        entities: Object.assign({}, state.entities, faultOrders.reduce((obj, order) => { obj[order.apiWorkorderBaseInfoDto.workorderId]=order; return obj }, {})),
        loadMoreDataCompleted: true,
        hasMoreData: faultOrders.length !== 0,
      }
    }
    case FaultOrderActions.AUTO_REFRESH_FAULT_ORDER_LIST:
    case FaultOrderActions.MANUAL_REFRESH_FAULT_ORDER_LIST: {
      return {
        ...state,
        ids: [],
        entities: {},
        refreshCompleted: false
      }
    }
    case FaultOrderActions.MANUAL_REFRESH_FAULT_ORDER_LIST_COMPLETED:
    case FaultOrderActions.AUTO_REFRESH_FAULT_ORDER_LIST_COMPLETED: {
      const faultOrders = (<FaultOrderActions.RefreshFaultOrdeListCompletedAction>action).faultOrders;
      return {
        ...state,
        ids: faultOrders.map(order => order.apiWorkorderBaseInfoDto.workorderId),
        entities: faultOrders.reduce((obj, order) => { obj[order.apiWorkorderBaseInfoDto.workorderId] = order; return obj; }, {}),
        hasMoreData: faultOrders.length !== 0,
        refreshCompleted:true
      }
    }
    case FaultOrderActions.UPDATE_SELECTED_FAULT_ORDER: {
      const selectedOrder = (<FaultOrderActions.UpdateSelectedFaultOrderAction>action).faultOrder;
      return {
        ...state,
        selectedWorkOrderId: selectedOrder && selectedOrder.apiWorkorderBaseInfoDto ? selectedOrder.apiWorkorderBaseInfoDto.workorderId : state.selectedWorkOrderId
      }
    }
  }
}
export const RootFaultOrderEpics = combineEpics(autoRefreshFaultOrderListEpic, manualRefreshFaultOrderListEpic, updateSelectedFaultOrderEpic, loadMoreFaultOrdersEpic);

export function getFaultOrderItems(state: AppState): Array<WorkOrder> {
  return state.businessDataState.workOrderState.faultOrderState.ids.map(id => state.businessDataState.workOrderState.faultOrderState.entities[id]);
}
