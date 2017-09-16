import { ActionsObservable } from 'redux-observable';
import { Action, Store } from 'redux';
import { AppState, EpicDependencies } from '../../app/app.reducer';
import { LOGIN_SUCCESS } from '../../user/user.actions';
import * as moment from "moment/moment";
import { tableNames } from '../../providers/db-operation/mro.tables';
import { FETCH_MANUAL_INSTRUCTOR_DATA, fetchManualInstructorDataCompleted } from './instructor.actions';
import { MroUtils } from '../../common/mro-util';
import { MroResponse } from '../../common/mro-response';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MroError, MroErrorCode, generateMroError } from '../../app/mro-error-handler';
import { ManualInstructor } from './instructor.modal';
import * as R from "ramda";
import { not } from 'ramda';
import { ManualInstructorState } from './instructor.reducer';
import { BaseDataStateTypes } from '../base-data.actions';
import { SELECT_COMPANY } from '../../company/company.actions';
import 'rxjs/add/operator/pluck';

export const fetchManualInstructorsEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  let serverTime = Date.now();
  return action$.ofType(FETCH_MANUAL_INSTRUCTOR_DATA, LOGIN_SUCCESS)
    .switchMap(() => {
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_actions} where syncAction=?`, [FETCH_MANUAL_INSTRUCTOR_DATA])
        .map(res => {
          const result = MroUtils.changeDbRecord2Array(res);
          let lastSyncSuccessTime = 0;
          if (result.length > 0) {
            lastSyncSuccessTime = result[0]['lastSyncSuccessTime'] || 0;
          }
          return lastSyncSuccessTime;
        })
    })
    .switchMap(lastSyncSuccessTime => {
      return deps.http.get(deps.mroApis.getCurServerTimeApi)
        .map((res: MroResponse) => res.data)
    }, (last_update_time, now_server_date) => ({ last_update_time, now_server_date }))
    .switchMap(({ last_update_time, now_server_date }) => {
      serverTime = now_server_date;//当前服务器的时间
      const repeat$ = new Subject();
      const maxRetryCount = 4;
      const bufferCount = 10;
      const params = {
        page: 0,
        startDate: moment(last_update_time).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(now_server_date).format('YYYY-MM-DD HH:mm:ss')
      };
      return Observable.empty().startWith("fetchManuals")
        // .do((r) => console.log(r, params))
        .switchMap(() => {
          return deps.http.post(deps.mroApis.fetchManualInstrutorApi, params)
            .do((res) => console.log(res['data']))
            .map((res: MroResponse) => {
              if (res.data['dataObject'] && res.data['dataObject']['manualInfoDTO']) {
                params.page++;
                setTimeout(() => repeat$.next(), 0);
              } else {
                setTimeout(() => {
                  repeat$.complete();
                }, 0);
              }
              return res.data['dataObject'];
            });
        })
        .filter(r => !R.isNil(r['manualInfoDTO']))
        .repeatWhen(() => repeat$.asObservable())
        .retryWhen(err$ => Observable.range(0, maxRetryCount)
          .zip(err$, (i, err) => ({ i, err }))
          .mergeMap(({ i, err }) => {
            if (i === maxRetryCount - 1) {
              return Observable.throw(err);
            }
            return Observable.timer(i * 2000);
          })
        )
        .bufferCount(bufferCount)
        // .do(values => console.log(values))
        .switchMap((manuals: ManualInstructor[]) => {
          console.log(manuals);
          const insertSql = `insert into ${tableNames.eam_sync_manual_instructor}(manualId,manualInstructorJson)values(?,?)`;
          const sqls = [];
          const ids = manuals.map((manual) => manual.manualInfoDTO.manualId);
          sqls.push(`delete from ${tableNames.eam_sync_manual_instructor} where manualId in (${ids})`);
          manuals.forEach((manual) => {
            const values = [];
            values.push(manual.manualInfoDTO.manualId);
            values.push(JSON.stringify(manual));
            sqls.push([insertSql, values]);
          })
          const updateSyncActionSql = `update ${tableNames.eam_sync_actions} set lastSyncSuccessTime=?,syncStatus=? where syncAction=?`;
          sqls.push([updateSyncActionSql, [serverTime, 1, FETCH_MANUAL_INSTRUCTOR_DATA]]);
          const state: ManualInstructorState = {
            ids: [],
            isCompleted: true,
            manualInstructorEntities: {}
          }
          sqls.push([`update ${tableNames.eam_sync_base_data_state} set stateJson=? where type=?`, [JSON.stringify(state), BaseDataStateTypes.manualStateType.type]])
          return deps.db.sqlBatch(sqls)
            .switchMap(() => {
              const ids = store.getState().baseDataState.manualInstructorState.ids || [];
              return deps.db.executeSql(`select * from ${tableNames.eam_sync_manual_instructor} where manualId in (${ids})`)
                .map(res => MroUtils.changeDbRecord2Array(res))
            })
        })
    })
    .map((manuals) => fetchManualInstructorDataCompleted(manuals))
    .catch(e => {
      console.error(e);
      let err = new MroError(MroErrorCode.fetch_projects_error_code, '获取指导书失败', JSON.stringify(e));
      return Observable.of(generateMroError(err));
    })
}
