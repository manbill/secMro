import { ActionsObservable } from 'redux-observable';
import { AppState, EpicDependencies } from '../../app/app.reducer';
import { Action, Store } from 'redux';
import * as MaterialActions from "./material.actions";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { generateMroError, MroError, MroErrorCode } from '../../app/mro-error-handler';
export const fetchMaterialsEpic=(action$:ActionsObservable<Action>,store:Store<AppState>,deps:EpicDependencies)=>{
  return action$.ofType(MaterialActions.fetchMaterialData())
  .switchMap(()=>{
    return Observable.of(null);
  })
  .map(materials=>MaterialActions.fetchMaterialDataCompleted(materials))
  .catch(e=>{
    let err = new MroError(MroErrorCode.fetch_dictionary_error_code,'获取物料信息失败',JSON.stringify(e));
    return Observable.of(generateMroError(err));
  })
}
