import { DbOperationProvider } from './../../providers/db-operation/db-operation';
import { FETCH_MAINTENANCE_TASK_DATA, fetchMaintenanceTaskOrdersCompleted } from './planned-work-order/maintenance-orders/maintenance-order.actions';
import { BusinessDataSyncActions, BusinessWorkOrderDataSyncActionsEntities } from './../business.actions';
import { SELECT_PROJECT } from './../../project/project.actions';
import { WorkOrder, ApiWorkorderBaseInfoDto } from './work-order.modal';
import { Subject } from 'rxjs/Subject';
import { MroError } from './../../app/mro-error';
import { MroUtils } from './../../common/mro-util';
import { AppState, EpicDependencies } from './../../app/app.reducer';
import { tableNames } from './../../providers/db-operation/mro.tables';
import { Observable } from 'rxjs/Observable';
import { Store, Action } from 'redux';
import { ActionsObservable } from 'redux-observable';
import 'rxjs/add/observable/from';
import { fetchWorkOrderDataCompleted } from './work-order.actions';
import { FETCH_FAULT_ORDER_DATA } from './fault-order/fault-order.actions';
import { MroResponse } from '../../common/mro-response';
import 'rxjs/add/operator/concatMap';
import { generateMroError } from '../../app/app.actions';

export const fetchWorkOrderEpics = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(...Object.keys(BusinessWorkOrderDataSyncActionsEntities))
    .mergeMap((action) => {
      console.log('执行的工单下载动作', action);
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_actions} where syncAction=?`, [action.type])
        .map(res => {
          let lastSyncSuccessTime = 0;
          const results = MroUtils.changeDbRecord2Array(res);
          if (results.length > 0) {
            lastSyncSuccessTime = results[0]['lastSyncSuccessTime'] || 0;
          }
          return lastSyncSuccessTime;
        });
    }, (action, lastSyncSuccessTime) => ({ action, lastSyncSuccessTime }))
    .mergeMap(({ action, lastSyncSuccessTime }) => {
      return deps.http.get(deps.mroApis.getCurServerTimeApi)
        .map((res: MroResponse) => res.data);
    }, (actionAndLastSyncTime, curServerTime) => ({ actionAndLastSyncTime, curServerTime }))
    .do((value) => console.log(value))
    .mergeMap(({ actionAndLastSyncTime, curServerTime }) => {
      const lastSyncSuccessTime = actionAndLastSyncTime['lastSyncSuccessTime'];
      const loading = deps.loading.create();
      loading.setContent('正在下载工单...');
      loading.present();
      const maxRetryCount = 3;
      const retryInterval = 2000;
      const downloadCount = 5;//每次下载多少条工单详情数;
      const batchCount = 10;//每次批量处理的工单数，这里是downloadCount的倍数
      return Observable.create(observer => {
        if (actionAndLastSyncTime['action'].type === FETCH_FAULT_ORDER_DATA) {//如果是故障工单
          return deps.http.post(deps.mroApis.getBatchWorkorderListApi, {
            workorderTypeString: '37',
            startDate: lastSyncSuccessTime,
            endDate: curServerTime,
            projectId: store.getState().userState.projectState.selectedProject.projectId
          })
            .do(scada => console.log('风云系统', scada))
            .switchMap((res) => {
              return deps.http.post(deps.mroApis.getBatchWorkorderListApi, {
                workorderTypeString: '38',
                startDate: lastSyncSuccessTime,
                endDate: curServerTime,
                projectId: store.getState().userState.projectState.selectedProject.projectId
              })
                .do(manual => console.log('手工工单', manual))
            }, (scada, manual) => ({ scada, manual }))
            .do(({ scada, manual }) => console.log('所有的故障工单', scada['data'].concat(manual['data'])))
            .map(({ scada, manual }) => {
              const res = {
                data: scada['data'].concat(manual['data']),
                retCode: manual['retCode'],
                retInfo: manual['retInfo']
              }
              return res;
            })
            .subscribe(observer);
        }
        deps.http.post(deps.mroApis.getBatchWorkorderListApi, {
          workorderTypeString: BusinessWorkOrderDataSyncActionsEntities[actionAndLastSyncTime['action'].type].workorderTypeString,//	工单类型(查询时// :pc端:37-风云工单,38-人工工单,39-工程工单,67-服务工单,68-整改/技改工单;手机端:4-scada工单；返回时，都是按照pc端的);传入空字符串，返回所有类型工单
          startDate: lastSyncSuccessTime,
          endDate: curServerTime,
          projectId: store.getState().userState.projectState.selectedProject.projectId
        })
          .subscribe(observer);
      })
        .retryWhen(err$ =>
          Observable.range(0, maxRetryCount).zip(err$, (i, err) => ({ i, err }))
            .mergeMap(({ i, err }) => {
              if (i === maxRetryCount - 1) {
                return Observable.throw(err);
              }
              return Observable.timer(i * retryInterval);
            })
        )
        .map((res: MroResponse) => res.data)
        .do(res => console.log(`需要下载的${actionAndLastSyncTime['action'].type} 数据`, res))
        .mergeMap((orders: ApiWorkorderBaseInfoDto[]) => {
          if (orders.length === 0) {
            return Observable.empty();
          }
          const repeat$ = new Subject();
          const params = orders.map(order => ({
            workorderId: order.workorderId,
            workorderType: order.workorderType
          })) || [];
          let fullInfoParams = params.splice(0, downloadCount);
          return Observable.empty().startWith('fetchOrdersDetailInfo')
            .do(() => console.log(fullInfoParams))
            .mergeMap(() => {
              return deps.http.post(deps.mroApis.getWorkorderFullInfoListApi, { apiWorkorderBaseInfoDto: fullInfoParams })
                .retryWhen(err$ =>
                  Observable.range(0, maxRetryCount).zip(err$, (i, err) => ({ i, err }))
                    .mergeMap(({ i, err }) => {
                      if (i === maxRetryCount - 1) {
                        return Observable.throw(err);
                      }
                      return Observable.timer(i * retryInterval);
                    })
                )
            })
            .repeatWhen(() => repeat$.asObservable())
            .map(res => {
              if (params.length > 0) {
                setTimeout(() => repeat$.next(), 0);
                fullInfoParams = params.splice(0, downloadCount);
              } else {
                setTimeout(() => repeat$.complete(), 0);
              }
              return res['data'];
            })
            .do(res => console.log(res))
            .filter(val => MroUtils.isNotEmpty(val))
            .bufferCount(batchCount)
            .filter(arr => arr.length > 0)
            .do((values) => console.log(values))
            .mergeMap((detailInfos: Array<WorkOrder[]>) => upsertWorkOrders(detailInfos, deps.db))
            .takeLast(1)
        })
        .finally(() => loading.dismiss());
    }, actionAndLastSyncTimeCurServerTime => actionAndLastSyncTimeCurServerTime)
    .do((actionAndLastSyncTimeCurServerTime) => console.log('完成所有工单数据下载,actionAndLastSyncTimeCurServerTime', actionAndLastSyncTimeCurServerTime))
    .mergeMap((actionAndLastSyncTimeCurServerTime) => {
      const sqls = [];
      return deps.db.executeSql(`update ${tableNames.eam_sync_actions} set lastSyncSuccessTime=?,syncStatus=? where syncAction=?`, [actionAndLastSyncTimeCurServerTime['curServerTime'], 1, actionAndLastSyncTimeCurServerTime['actionAndLastSyncTime']['action'].type]);
    })
    .mapTo(fetchWorkOrderDataCompleted())
    .catch((e: MroError) => {
      console.error(e);
      return Observable.throw(generateMroError(e));
    })
    .do((res) => console.log(res))
}
export function upsertWorkOrders(detailInfos: Array<WorkOrder[]>, db: DbOperationProvider): Observable<any> {
  const sqls = [];
  const ids = [];
  detailInfos.map(orders => {
    orders.map((order) => {
      ids.push(order.apiWorkorderBaseInfoDto.workorderId);
    });
  });
  console.log(ids);
  sqls.push(`delete from ${tableNames.eam_sync_work_order} where workorderId in (${ids})`);
  const insertSql = `insert into ${tableNames.eam_sync_work_order}(
    activeFlag,
    areaType,
    areaTypeName,
    assignPerson,
    faultBegindate,
    faultCode,
    faultName,
    lastUpdateDatetimeApi,
    createOn,
    planBegindate,
    planEnddate,
    planNoticeId,
    positionCode,
    positionId ,
    projectId,
    projectName,
    siteManager,
    taskAccepted,
    transNoticeNo,
    workTypeId,
    workTypeName,
    workorderCode,
    workorderId,
    workorderStatus,
    workorderStatusName,
    uploadStatus,
    downloadStatus,
    workorderTitle,
    workorderType,
    workorderTypeName,
    json
  )values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  detailInfos.forEach((orders) => {
    orders.forEach((order) => {
      const values = [];
      values.push(order.apiWorkorderBaseInfoDto.activeFlag);
      values.push(order.apiWorkorderBaseInfoDto.areaType);
      values.push(order.apiWorkorderBaseInfoDto.areaTypeName);
      values.push(order.apiWorkorderBaseInfoDto.assignPerson);
      values.push(order.apiWorkorderBaseInfoDto.faultBegindate);
      values.push(order.apiWorkorderBaseInfoDto.faultCode);
      values.push(order.apiWorkorderBaseInfoDto.faultName);
      values.push(order.apiWorkorderBaseInfoDto.lastUpdateDatetimeApi);
      values.push(order.workorderDetails.eaWoWorkorderinfoDto.createOn);
      values.push(order.apiWorkorderBaseInfoDto.planBegindate);
      values.push(order.apiWorkorderBaseInfoDto.planEnddate);
      values.push(order.apiWorkorderBaseInfoDto.planNoticeId);
      values.push(order.apiWorkorderBaseInfoDto.positionCode);
      values.push(order.apiWorkorderBaseInfoDto.positionId);
      values.push(order.apiWorkorderBaseInfoDto.projectId);
      values.push(order.apiWorkorderBaseInfoDto.projectName);
      values.push(order.apiWorkorderBaseInfoDto.siteManager);
      values.push(order.apiWorkorderBaseInfoDto.taskAccepted);
      values.push(order.apiWorkorderBaseInfoDto.transNoticeNo);
      values.push(order.apiWorkorderBaseInfoDto.workTypeId);
      values.push(order.apiWorkorderBaseInfoDto.workTypeName);
      values.push(order.apiWorkorderBaseInfoDto.workorderCode);
      values.push(order.apiWorkorderBaseInfoDto.workorderId);
      values.push(order.apiWorkorderBaseInfoDto.workorderStatus);
      values.push(order.apiWorkorderBaseInfoDto.workorderStatusName);
      values.push(0);//uploadStatus
      values.push(1);//downloadStatus
      values.push(order.apiWorkorderBaseInfoDto.workorderTitle);
      values.push(order.apiWorkorderBaseInfoDto.workorderType);
      values.push(order.apiWorkorderBaseInfoDto.workorderTypeName);
      values.push(JSON.stringify(order));
      sqls.push([insertSql, values]);
    });
  });
  return db.sqlBatch(sqls);
}
