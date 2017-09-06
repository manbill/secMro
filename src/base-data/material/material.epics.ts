import { ActionsObservable, combineEpics } from 'redux-observable';
import { AppState, EpicDependencies } from '../../app/app.reducer';
import { Action, Store } from 'redux';
import * as MaterialActions from "./material.actions";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { tableNames } from "../../providers/db-operation/mro.tables";
import { generateMroError, MroError, MroErrorCode } from '../../app/mro-error-handler';
import { MroUtils } from '../../common/mro-util';
import { MroResponse } from '../../common/mro-response';
export const fetchMaterialsEpic=(action$:ActionsObservable<Action>,store:Store<AppState>,deps:EpicDependencies)=>{
  return action$.ofType(MaterialActions.fetchMaterialData())
  .switchMap(()=>{
    return deps.db.executeSql(`select * from ${tableNames.eam_sync_actions} where syncAction=?`,[MaterialActions.FETCH_MATERIAL_DATA])
    .map(res=>MroUtils.changeDbRecord2Array(res)['lastSyncSuccessTime']||0);
  })
  .switchMap(lastSyncTime=>{
    return deps.http.get(deps.mroApis.getCurServerTimeApi).map((res:MroResponse)=>res.data);
  },(lastSyncTime,serverTime)=>({lastSyncTime,serverTime}))
  .switchMap(({lastSyncTime,serverTime})=>{
    return deps.http.post(deps.mroApis.fetchMaterialApi,{})
  })
  .map(materials=>MaterialActions.fetchMaterialDataCompleted(materials))
  .catch(e=>{
    let err = new MroError(MroErrorCode.fetch_dictionary_error_code,'获取物料信息失败',JSON.stringify(e));
    return Observable.of(generateMroError(err));
  })
}
export const MaterialEpics=combineEpics(fetchMaterialsEpic);
