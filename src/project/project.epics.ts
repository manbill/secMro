import { MroError ,generateMroError,MroErrorCode} from './../app/mro-error-handler';
import { Observable } from 'rxjs/Observable';
import { MroUtils } from './../common/mro-util';
import { ActionsObservable } from 'redux-observable';
import { AppState, EpicDependencies } from '../app/app.reducer';
import { Store, Action } from 'redux';
import { LOGIN_SUCCESS } from "../user/user.actions";
import { fetchProjectsSuccess } from "./project.actions";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';

export const fetchProjectsEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => action$.ofType(LOGIN_SUCCESS)
.switchMap(()=>{
  const loading =deps.loading.create({
    content:'获取项目...'
  });
  loading.present();
  return deps.http.post(deps.mroApis.fetchProjectsApi,{},MroUtils.generatePostReqArgs(store.getState().userState.currentUser.token))
  .do((res)=>{
    loading.dismiss();
    console.log("返回的项目信息：",res.json().data);
  })
  .map(res=>fetchProjectsSuccess(res.json().data))
  .catch((e:Error)=>{
    console.error(e);
      let err = new MroError(MroErrorCode.fetch_projects_error_code,`获取项目失败，${e.message}`,JSON.stringify(e));
      return Observable.of(generateMroError(err));
  })
})
