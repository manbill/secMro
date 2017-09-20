import { generateMroError } from './../../app/mro-error-handler';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { MroUtils } from './../../common/mro-util';
import { tableNames } from './../../providers/db-operation/mro.tables';
import { FanMachine, FanMachineEquipmentDetails, DeviceTree } from './fan.modal';
import { AppState, EpicDependencies } from './../../app/app.reducer';
import { ActionsObservable } from 'redux-observable';
import { Action, Store } from 'redux';
import * as FanMachineActions from "./fan.actions";
import { getUserSelectedProjectId } from '../../user/user.reducer';
export const fetchMachinesEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(FanMachineActions.FETCH_FAN_MACHINE_EQUIPMENTS_DATA)
    .switchMap((action) => {
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_actions} where syncAction=?`, [action.type])
        .map(MroUtils.changeDbRecord2Array)
        .map(res => {
          let lastSyncTime = 0;
          if (res.length > 0) {
            lastSyncTime = res[0]['lastSyncSuccessTime'] || 0;
          }
          return lastSyncTime;
        })
    }, (action, lastSyncTime) => ({ action, lastSyncTime }))
    .switchMap((actionAndLastSyncTime) => deps.http.get(deps.mroApis.getCurServerTimeApi)
      .map(res => res['data']), (actionAndLastSyncTime, curServerTime) => ({ actionAndLastSyncTime, curServerTime })
    ).do(({ actionAndLastSyncTime, curServerTime }) => console.log({ actionAndLastSyncTime, curServerTime }))
    .switchMap(({ actionAndLastSyncTime, curServerTime }) => {
      const lastSyncTime = actionAndLastSyncTime['lastSyncTime'];
      return deps.http.post(deps.mroApis.fetchMachineList, {
        pageNumber: 1,
        startDateTime: lastSyncTime,
        endDateTime: curServerTime,
        pageSize: 1073741824,//将返回时间段内所有的风机
        projectId: getUserSelectedProjectId(store.getState())
      })
    }, (actionLastSyncTimeCurServerTime, machinesRes) => ({ actionLastSyncTimeCurServerTime, machinesRes }))
    .switchMap(({ actionLastSyncTimeCurServerTime, machinesRes }) => {
      const action = actionLastSyncTimeCurServerTime['action'];
      const machines: FanMachine[] = machinesRes['data'];
      const bufferCount = 1;//10的倍数
      const downloadCount = 10;
      const ids = machines.map(machine => machine.id);
      let count = 1;
      const maxRetryCount = 3;
      const retryInterval = 2000;
      const repeat$ = new Subject();
      return Observable.empty().startWith('fetchMachines')
        .switchMap(() => {
          const machineIds = ids.splice(0, downloadCount);
          return deps.http.post(deps.mroApis.fetchMachineDetails, {
            machineIds: machineIds
          })
            .map(res => res['data'])
            .do(() => console.log('第%d次下载风机%d台/%d总共台', count++, machineIds.length, machines.map(machine => machine.id).length))
        })
        .retryWhen(err$ => Observable.range(0, maxRetryCount).zip(err$, (i, err) => ({ i, err }))
          .mergeMap(({ i, err }) => {
            if (i === maxRetryCount - 1) {
              return Observable.throw(err);
            }
            return Observable.timer(i * retryInterval);
          }))
        .repeatWhen(() => repeat$.asObservable())
        .map(machineDetails => {
          if (machineDetails.length > 0) {
            setTimeout(() => repeat$.next(), 0);
          } else {
            setTimeout(() => repeat$.complete());
          }
          return machineDetails;
        })
        .filter(val => MroUtils.isNotEmpty(val))
        .bufferCount(bufferCount)
        .do(values => console.log(values))
        .mergeMap((machineDetails: [FanMachineEquipmentDetails[]]) => {
          const sqls = [];
          sqls.push(`delete from ${tableNames.eam_sync_fan_machine_equipment} where id in (${machines.map(machine => machine.id)})`);
          const insertMachineSql = `insert into ${tableNames.eam_sync_fan_machine_equipment}(
            id,
            machineTypeName,
            machineId,
            machineTypeId,
            projectId,
            projectName,
            positionId,
            areaCode,
            areaName,
            positionCode,
            fanMachineJson
          )values(?,?,?,?,?,?,?,?,?,?,?)`;
          machines.forEach(machine => {
            const values = [];
            values.push(machine.id + "");
            values.push(machine.machineTypeName);
            values.push(machine.machineId);
            values.push(machine.machineTypeId);
            values.push(machine.projectId + "");
            values.push(machine.projectName);
            values.push(machine.positionId + '');
            values.push(machine.areaCode);
            values.push(machine.areaName);
            values.push(machine.positionCode);
            values.push(JSON.stringify(machine));
            sqls.push([insertMachineSql, values]);
          });
          sqls.push(`delete from ${tableNames.eam_sync_fan_machine_equipment_detail} where id in (${machineDetails.map(m => m.map(ma => ma.id))})`);
          const insertDetailSql = `insert into ${tableNames.eam_sync_fan_machine_equipment_detail}(
              id,
              machineId,
              equipmentTreeJson,
              equipmentsDetailsJson,
              fanMachineInfo
            )values(?,?,?,?,?)`;
          machineDetails.forEach(ma => {
            ma.forEach(m => {
              const values = [];
              values.push(m.id);
              values.push(m.machineId);
              values.push(JSON.stringify(m.deviceTree));
              values.push(JSON.stringify(m.equipmentId2EquipmentDetails));
              values.push(JSON.stringify(m.machineDTO));
              sqls.push([insertDetailSql, values]);
            })
          })
          // console.log(sqls)
          return deps.db.sqlBatch(sqls);
        }, () => actionLastSyncTimeCurServerTime)
        .do(() => console.log("完成一次风机设备批量操作"))
        .takeLast(1)
    })
    .do((res) => console.log('完成所有风机设备下载和缓存', res))
    .switchMap(actionLastSyncTimeCurServerTime => {
      const action = actionLastSyncTimeCurServerTime['actionAndLastSyncTime']['action'];
      const serverTime = actionLastSyncTimeCurServerTime['curServerTime'];
      return deps.db.executeSql(`update ${tableNames.eam_sync_actions} set lastSyncSuccessTime=?,syncStatus=? where syncAction=?`, [serverTime, 1, action['type']]);
    })
    .switchMap(() => {
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_fan_machine_equipment} order by positionCode limit 0,${deps.pagination}`)
        .map(MroUtils.changeDbRecord2Array)
        .do((r) => console.log(`下载完成，从数据库中获取${deps.pagination}条数据`, r));
    })
    .map((machines: FanMachine[] ) => FanMachineActions.fetchFanMachineDataCompleted(machines))
    .catch(e => {
      console.error(e);
      return Observable.throw(generateMroError(e));
    })
}
export const manualRefreshMachineListEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(FanMachineActions.MANUAL_REFRESH_FAN_MACHINE_LIST)
    .switchMap(() => {
      let where = ` order by positionCode limit 0,${deps.pagination}`;
      return deps.db.executeSql(`select fanMachineJson from ${tableNames.eam_sync_fan_machine_equipment} ${where}`)
        .map(res => {
          const results = MroUtils.changeDbRecord2Array(res);
          return results.map(r => JSON.parse(r['fanMachineJson']));
        })
    })
    .do((res)=>console.log(res))
    .map(res=>FanMachineActions.manualRefreshMachineDataCompleted(res));
}
export const getMachineFanDetailsEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(FanMachineActions.GET_SELECTED_MACHINE_EQUIPMENT_DETAILS)
    .switchMap(() => {
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_fan_machine_equipment_detail} where id=?`, [store.getState().businessDataState.fanMachineState.selectedFanMachineId])
        .map(MroUtils.changeDbRecord2Array)
        .map((res) => {
          let fanDetail: FanMachineEquipmentDetails = {
            deviceTree: null,
            equipmentId2EquipmentDetails: {},
            id: null,
            machineDTO: null,
            machineId: null
          };
          if (res.length > 0) {
            fanDetail.deviceTree = JSON.parse(res[0]['equipmentTreeJson']);
            fanDetail.equipmentId2EquipmentDetails = JSON.parse(res[0]['equipmentsDetailsJson']);
            fanDetail.id = res[0].id;
            fanDetail.machineId = res[0].machineId;
            fanDetail.machineDTO = JSON.parse(res[0]['fanMachineInfo']);

          };
          console.log('获取风机详情信息成功', fanDetail);
          return FanMachineActions.getFanMachineEquipmentDetailsCompleted(fanDetail);
        });
    })
    .catch(e => {
      console.error(e);
      return Observable.throw(generateMroError(e));
    })
}
export const selectMachineEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(FanMachineActions.SELECT_MACHINE)
    .mapTo(FanMachineActions.getFanMachineEquipmentDetails());
}
export const loadMoreMachinesEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(FanMachineActions.LOAD_MORE_MACHINE_DATA)
    .switchMap((action) => {
      const searchParams = (<FanMachineActions.LoadMoreMachineDataAction>action).searchParams;
      const skipRecords = ((searchParams.pageNumber || 1) - 1) * deps.pagination;
      let where = '';
      const values = [];
      if (MroUtils.isNotEmpty(searchParams.ids)) {
        where += ` and id in (${searchParams.ids})`;
      }
      if (MroUtils.isNotEmpty(searchParams.machineId)) {
        where += ` and machineId like ?`;
        values.push(`%${searchParams.machineId}%`);
      }
      if (MroUtils.isNotEmpty(searchParams.positionCode)) {
        where += ` and positionCode = ?`;
        values.push(searchParams.positionCode);
      }
      where += ` order by positionCode limit ?,${deps.pagination}`;
      values.push(skipRecords);
      const sql = `select fanMachineJson from ${tableNames.eam_sync_fan_machine_equipment} where 1=1 ${where}`;
      console.log(sql, values);
      return deps.db.executeSql(sql, values)
        .map(res => {
          const results = MroUtils.changeDbRecord2Array(res);
          return results.map(r => JSON.parse(r['fanMachineJson']));
        })
    })
    .do(res => console.log('筛选结果', res))
    .map(res => FanMachineActions.loadMoreFanMachineDataCompleted(res))
    .catch(e => {
      console.error(e);
      return Observable.throw(generateMroError(e));
    })
}
