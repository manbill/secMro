import { AppState, EpicDependencies } from './../../../app/app.reducer';
import { ActionsObservable } from 'redux-observable';
import { Store, Action } from 'redux';
import * as FaultOrderActions from './fault-order.actions'
import { MANUAL_REFRESH_FAULT_ORDER_LIST, AutoRefreshFaultOrderListAction } from './fault-order.actions';
import { tableNames } from '../../../providers/db-operation/mro.tables';
import { MroUtils } from '../../../common/mro-util';
import { WorkOrder } from '../work-order.modal';
export const autoRefreshFaultOrderListEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(FaultOrderActions.AUTO_REFRESH_FAULT_ORDER_LIST)
    .switchMap((action) => {
      const searchParams = (<AutoRefreshFaultOrderListAction>action).searchParams;
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_work_order} where workorderId in (${searchParams ? searchParams.ids : []})`)
        .map(res => MroUtils.changeDbRecord2Array(res));
    })
    .map(faultOrders => FaultOrderActions.autoRefreshFaultOrdeListCompleted(faultOrders));
}
export const manualRefreshFaultOrderListEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(FaultOrderActions.MANUAL_REFRESH_FAULT_ORDER_LIST)
    .switchMap(action => {
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_work_order} where  workorderType in(37,38) limit ?,${deps.pagination}`, [0])
        .map(MroUtils.changeDbRecord2Array)
        .map(res => res.map(r => JSON.parse(r['json'])))
        .do(res => console.log(res))
    })
    .map(res => FaultOrderActions.manualRefreshFaultOrderListCompleted(res));
}
export const updateSelectedFaultOrderEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(FaultOrderActions.AUTO_REFRESH_FAULT_ORDER_LIST_COMPLETED, FaultOrderActions.MANUAL_REFRESH_FAULT_ORDER_LIST_COMPLETED)
    .switchMap(() => deps.db.executeSql(`select * from ${tableNames.eam_sync_work_order} where workorderId=?`, [store.getState().businessDataState.workOrderState.faultOrderState.selectedWorkOrderId]).map(MroUtils.changeDbRecord2Array))
    .map(res => {
      let order: WorkOrder = new WorkOrder();
      if (res.length > 0) {
        order = JSON.parse(res[0]['json']);
      }
      return FaultOrderActions.updateSelectedFaultOrder(order);
    })
}
export const loadMoreFaultOrdersEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(FaultOrderActions.LOAD_MORE_FAULT_ORDER_DATA)
    .switchMap((action) => {
      console.log(action);
      const params = (<FaultOrderActions.LoadMoreFaultOrderDataAction>action).searchParams;
      console.log(params);
      const searchParams = params.searchParams;
      const skipRecords = ((params.pageNumber || 1) - 1) * deps.pagination;
      const values = [];
      let where = "";
      if (MroUtils.isNotEmpty(searchParams.workorderCode)) {
        where += ` and workorderCode like ? `;
        values.push(`%${searchParams.workorderCode}%`);
      }
      if (MroUtils.isNotEmpty(searchParams.faultCode)) {
        where += ` and faultCode like ? `;
        values.push(`%${searchParams.faultCode}%`);
      }
      if (MroUtils.isNotEmpty(searchParams.faultBegindate)) {//从xxx开始
        where += ` and faultBegindate >= ? `;
        values.push(`${searchParams.faultBegindate}`);
      }
      if (MroUtils.isNotEmpty(searchParams)) {//至xxx结束
        where += ` and faultBegindate <= ? `;
        values.push(`${searchParams.faultBegindate}`);
      }
      if (MroUtils.isNotEmpty(searchParams.workorderStatus)) {
        where += ' and workorderStatus=? ';
        values.push(searchParams.workorderStatus);
      }
      if (MroUtils.isNotEmpty(searchParams.workorderType)) {
        where += ' and workorderType=? ';
        values.push(searchParams.workorderType);
      }
      where += ` order by workorderCode desc limit ?,${deps.pagination}`;
      values.push(skipRecords);
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_work_order} where workorderType in(37,38) ${where}`, values)
        .map(MroUtils.changeDbRecord2Array)
        .map(res => res.map(r => JSON.parse(r['json'])));
    })
    .do(res => console.log('LoadMoreFaultOrderDataCompleted', res))
    .map(orders => FaultOrderActions.loadMoreFaultOrdersCompleted(orders));
}
