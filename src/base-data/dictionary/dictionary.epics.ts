import { MroUtils } from './../../common/mro-util';
import { Dictionary } from './dictionary.modal';
import { Observable } from 'rxjs/Observable';
import { MroError, MroErrorCode, generateMroError } from './../../app/mro-error-handler';
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
export const fetDictionaryDataEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  const loading = deps.loading.create({
    content: '正在同步字典数据...'
  });
  let curServerTime = '';
  return action$.ofType(DictonaryActions.FETCH_DICTIONARY_DATA)
    .switchMap(() => {
      loading.present();
      //获取本地上一次成功同步数据的时间,再获取服务器当前时间，通过时间段获取增量数据
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_actions} where syncAction=? and syncStatus=?`, [DictonaryActions.FETCH_DICTIONARY_DATA, 1]);
    })
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
    }, (lastTime, serverTime) => {
      curServerTime = serverTime;
      return [lastTime, serverTime];
    })
    .switchMap(([lastTime, serverTime]) => {
      return deps.http.post(deps.mroApis.fetchDictionaryApi, {
        startDate: lastTime,
        endDate: serverTime
      });
    })
    .switchMap((res: MroResponse) => {
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_dictionary_detail}`)
        .map(dbRes => MroUtils.changeDbRecord2Array(dbRes));
    }, (res: MroResponse, dbRes) => ([res.data, dbRes]))
    .switchMap(([newData, oldRecords]) => {
      if (newData.length === 0) {
        return Observable.of(oldRecords);
      }
      const updateSql = `update ${tableNames.eam_sync_dictionary_detail} set  detailName=?,dictionaryId=?,paraType=?,detailCode=?,detailComment=?,activeFlag=?,createBy=?,createOn=?,lastUpdBy=?,lastUpdOn=? where detailId=?`;
      const insertSql = `insert into ${tableNames.eam_sync_dictionary_detail}(detailName,dictionaryId,paraType,detailCode,detailComment,activeFlag,createBy,createOn,lastUpdBy,lastUpdOn,detailId)values(?,?,?,?,?,?,?,?,?,?,?)`;
      const sqls = [];
      for (let i = 0; i < newData.length; i++) {
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
        values.push(dict.createOn);
        values.push(dict.lastUpdBy);
        values.push(dict.lastUpdOn);
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
        .switchMap((newData) =>
          deps.db.executeSql(`select * from ${tableNames.eam_sync_dictionary_detail}`)
            .map((res => MroUtils.changeDbRecord2Array(res))),
        (newData, dbRecords) => ([newData, dbRecords]))
    })
    .do(() => loading.dismiss())
    .map(([newData, dbRecords]) => DictonaryActions.fetchdictionarycompleted(newData.length > 0 ? newData : dbRecords))
    .catch(e => {
      loading.dismiss();
      let err = new MroError(MroErrorCode.fetch_dictionary_error_code, '同步字典数据失败', JSON.stringify(e));
      return Observable.of(generateMroError(err));
    });
}
