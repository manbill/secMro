import { SELECT_PROJECT } from './../../project/project.actions';
import { MroError, MroErrorCode, generateMroError } from '../../app/mro-error-handler';
import { Observable } from 'rxjs/Observable';
import { MroResponse } from './../../common/mro-response';
import { AppState, EpicDependencies } from './../../app/app.reducer';
import { ActionsObservable } from 'redux-observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Action, Store } from "redux";
import { fetchWarehouseComplete, FETCH_WAREHOUSE_DATA } from './warehouse.actions';
import { Warehouse } from './warehouse.modal';
import { tableNames } from "../../providers/db-operation/mro.tables";
import { WarehouseState } from './warehouse.reducer';
import { BaseDataStateTypes } from '../base-data.actions';
import { LOGIN_SUCCESS } from '../../user/user.actions';
export const fetchWarehouseEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(FETCH_WAREHOUSE_DATA,LOGIN_SUCCESS)
    .switchMap(() => {
      const loading = deps.loading.create({
        content: '获取仓库信息...'
      });
      loading.present();
      return deps.http.post(deps.mroApis.fetchWarehouse, {})
        .do(() => loading.dismiss())
        .switchMap((res: MroResponse) => {
          const insertSql = `insert into ${tableNames.eam_sync_warehouse}(
            repertoryId,
            repertoryNo,
            repertoryName,
            repertoryLinkman,
            repertoryLinkmanId,
            repertoryContactNum,
            email,
            repertoryAddress,
            isBlockUp,
            isQuery,
            repertoryLevel,
            repertoryLimit,
            belongArea,
            belongAreaName,
            amount,
            projectId,
            projectName,
            repertoryLevelName,
            selProjects,
            isBlockUpName,
            isQueryName,
            consumeMoney,
            consumeNum
          )values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
          `
          const sqls = [];
          const warehouses: Warehouse[] = res.data;
          const ids = warehouses.map((warehouse) => warehouse.repertoryId);
          sqls.push(`delete from ${tableNames.eam_sync_warehouse} where repertoryId in (${ids})`);
          warehouses.forEach((warehouse) => {
            const values = [];
            values.push(warehouse.repertoryId);
            values.push(warehouse.repertoryNo);
            values.push(warehouse.repertoryName);
            values.push(warehouse.repertoryLinkman);
            values.push(warehouse.repertoryLinkmanId);
            values.push(warehouse.repertoryContactNum);
            values.push(warehouse.email);
            values.push(warehouse.repertoryAddress);
            values.push(warehouse.isBlockUp);
            values.push(warehouse.isQuery);
            values.push(warehouse.repertoryLevel);
            values.push(warehouse.repertoryLimit);
            values.push(warehouse.belongArea);
            values.push(warehouse.belongAreaName);
            values.push(warehouse.amount);
            values.push(warehouse.projectId);
            values.push(warehouse.projectName);
            values.push(warehouse.repertoryLevelName);
            values.push(warehouse.selProjects);
            values.push(warehouse.isBlockUpName);
            values.push(warehouse.isQueryName);
            values.push(warehouse.consumeMoney);
            values.push(warehouse.consumeNum);
            sqls.push([insertSql, values]);
          });
          const updateSyncActionSql = `update ${tableNames.eam_sync_actions} set lastSyncSuccessTime=?,syncStatus=? where syncAction=?`;
          sqls.push([updateSyncActionSql, [Date.now(), 1, FETCH_WAREHOUSE_DATA]]);
          const updateState = `update ${tableNames.eam_sync_base_data_state} set stateJson=? where type=?`;
          const state: WarehouseState = {//这些数据将长期常驻内存
            ids: ids,
            isCompleted:true,
            warehouseEntities: warehouses.reduce((entities, warehouse) => {
              entities[warehouse.repertoryId] = warehouse;
              return entities;
            }, {})
          }
          sqls.push([updateState, [JSON.stringify(state), BaseDataStateTypes.warehouseStateType.type]]);
          // console.log(sqls)
          return deps.db.sqlBatch(sqls);
        }, (res) => res)
        .map((res: MroResponse) => {
          return fetchWarehouseComplete(res.data);
        })
        .catch(e => {
          console.error(e);
          loading.dismiss();
          let err = new MroError(MroErrorCode.fetch_warehouse_error_code, `获取仓库信息失败`, JSON.stringify(e))
          return Observable.of(generateMroError(err));
        })
    })
}
export const doRefreshWarehousesEpic=(action$:ActionsObservable<Action>,store:Store<AppState>,deps:EpicDependencies)=>{

}
