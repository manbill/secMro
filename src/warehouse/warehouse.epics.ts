import { SELECT_PROJECT } from './../project/project.actions';
import { MroError, MroErrorCode, generateMroError } from '../app/mro-error-handler';
import { Observable } from 'rxjs/Observable';
import { MroResponse } from './../common/mro-response';
import { AppState, EpicDependencies } from './../app/app.reducer';
import { ActionsObservable } from 'redux-observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Action, Store } from "redux";
import { fetchWarehouseComplete } from "./warehouse.actions";
export const fettchWarehouseEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(SELECT_PROJECT)
    .switchMap(() => {
      const loading = deps.loading.create({
        content: '获取仓库信息...'
      });
      loading.present();
      return deps.http.post(deps.mroApis.fetchWarehouse, {})
        .do(() => loading.dismiss())
        .map((res: MroResponse) => {
          return fetchWarehouseComplete(res.data);
        })
        .catch(e=>{
          loading.dismiss();
          let err = new MroError(MroErrorCode.fetch_warehouse_error_code,`获取仓库信息失败`,JSON.stringify(e))
          return Observable.of(generateMroError(err));
        })
    })
}
