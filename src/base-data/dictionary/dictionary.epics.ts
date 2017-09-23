import { CANCEL_ANY_HTTP_REQUEST } from './../../app/app.actions';
import { MroUtils } from './../../common/mro-util';
import { Dictionary } from './dictionary.modal';
import { Observable } from 'rxjs/Observable';
import { MroError, MroErrorCode } from './../../app/mro-error';
import { MroResponse } from './../../common/mro-response';
import { tableNames } from './../../providers/db-operation/mro.tables';
import * as DictonaryActions from './dictionary.actions';
import { AppState, EpicDependencies } from './../../app/app.reducer';
import { ActionsObservable } from 'redux-observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Action, Store } from "redux";
import { DictionaryState } from './dictionary.reducer';
import { BaseDataStateTypes } from '../base-data.actions';
import { LOGIN_SUCCESS } from '../../user/user.actions';
import { Loading } from 'ionic-angular';
import { generateMroError } from '../../app/app.actions';
export const fetDictionaryDataEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(DictonaryActions.FETCH_DICTIONARY_DATA)
    .switchMap(() => {
      const loading = deps.loading.create({
        content: '正在同步字典数据...'
      });
      loading.present();
      //获取本地上一次成功同步数据的时间,再获取服务器当前时间，通过时间段获取增量数据
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_actions} where syncAction=? and syncStatus=?`, [DictonaryActions.FETCH_DICTIONARY_DATA, 1])
        .map(dbRecord => {
          let lastSyncSuccessTime = 0;
          if (dbRecord.rows.length > 0) {
            lastSyncSuccessTime = dbRecord.rows.item(0)['lastSyncSuccessTime'];
          }
          return lastSyncSuccessTime;
        })
        .switchMap(lastTime => {
          return deps.http.get(deps.mroApis.getCurServerTimeApi)
            .map(res => res['data'])
            .takeUntil(action$.ofType(CANCEL_ANY_HTTP_REQUEST))
        }, (lastTime, serverTime) => ({ lastTime, serverTime }))
        .switchMap(({ lastTime, serverTime }) => {
          return deps.http.post(deps.mroApis.fetchDictionaryApi, {
            startDate: lastTime,
            endDate: serverTime
          })
          .takeUntil(action$.ofType(CANCEL_ANY_HTTP_REQUEST))
        }, (lastTimeAndServerTime, res: MroResponse) => ({ lastTimeAndServerTime, res: res.data }))
        .switchMap(({ lastTimeAndServerTime, res }) => {
          return deps.db.executeSql(`select * from ${tableNames.eam_sync_dictionary_detail}`)
            .map(dbRes => MroUtils.changeDbRecord2Array(dbRes));
        }, (timeAndRes, oldRecords) => ({ timeAndRes, oldRecords }))
        .switchMap(({ timeAndRes, oldRecords }) => {
          const newData = timeAndRes.res;
          const lastTimeAndServerTime = timeAndRes.lastTimeAndServerTime;
          const lastTime = lastTimeAndServerTime.lastTime;
          const curServerTime = lastTimeAndServerTime.serverTime;
          const updateSql = `update ${tableNames.eam_sync_dictionary_detail} set  detailName=?,dictionaryId=?,paraType=?,detailCode=?,detailComment=?,activeFlag=?,createBy=?,createOn=?,lastUpdBy=?,lastUpdOn=? where detailId=?`;
          const insertSql = `insert into ${tableNames.eam_sync_dictionary_detail}(detailName,dictionaryId,paraType,detailCode,detailComment,activeFlag,createBy,createOn,lastUpdBy,lastUpdOn,detailId)values(?,?,?,?,?,?,?,?,?,?,?)`;
          const sqls = [];
          for (let i = 0; i < newData['length']; i++) {
            let isUpdate = false;
            const values = [];
            let dict: Dictionary = newData[i];
            values.push(dict.detailName);
            values.push(dict.dictionaryId);
            values.push(dict.paraType);
            values.push(dict.detailCode);
            values.push(dict.detailComment);
            values.push(dict.activeFlag);
            values.push(dict.createBy);
            values.push(dict.createOn ? new Date(dict.createOn).getTime() : dict.createOn);
            values.push(dict.lastUpdBy);
            values.push(dict.lastUpdOn ? new Date(dict.lastUpdOn).getTime() : dict.lastUpdOn);
            values.push(dict.detailId);
            for (let j = 0; j < oldRecords.length; j++) {
              let old: Dictionary = oldRecords[j];
              if (dict.detailId === old.detailId) {
                isUpdate = true;
                sqls.push([updateSql, values]);
                oldRecords.splice(j, 1);
              }
            }
            if (!isUpdate) {
              sqls.push([insertSql, values]);
            }
          }
          sqls.push([`update ${tableNames.eam_sync_actions} set lastSyncSuccessTime=?,syncStatus=? where syncAction=?`, [curServerTime, 1, DictonaryActions.FETCH_DICTIONARY_DATA]]);
          return deps.db.sqlBatch(sqls)
            .map(() => newData)
            .switchMap((newData) =>
              deps.db.executeSql(`select * from ${tableNames.eam_sync_dictionary_detail}`)
                .map((res => MroUtils.changeDbRecord2Array(res))),
            (newData, dbRecords) => ({ newData, dbRecords }))
        })
        .switchMap(({ newData, dbRecords }) => {
          const dicts: Dictionary[] = newData || dbRecords;
          const dictSatate: DictionaryState = {
            detailIds: dicts.map(dict => dict.detailId),
            isCompleted: true,
            dictionaryEntities: dicts.reduce((entities, dict) => {
              entities[dict.detailId] = dict;
              return entities;
            }, {})
          }
          return deps.db.executeSql(`update ${tableNames.eam_sync_base_data_state} set stateJson=? where type=?`, [JSON.stringify(dictSatate), BaseDataStateTypes.dictionaryStateType.type])
            .map(() => ({ newData, dbRecords }))
        })
        .map(({ newData, dbRecords }) => DictonaryActions.fetchdictionarycompleted(newData.length > 0 ? newData : dbRecords))
        .catch(e => {
          console.error(e)
          let err = new MroError(MroErrorCode.fetch_dictionary_error_code, '同步字典数据失败', JSON.stringify(e));
          return Observable.of(generateMroError(err));
        })
        .finally(() => loading.dismiss())
    })
}
