import {ActionsObservable} from 'redux-observable';
import { AppState, EpicDependencies } from '../app/app.reducer';
import { Store,Action } from 'redux';
import * as UserActions from "./user.actions";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { MroError, MroErrorCode, generateMroError } from '../app/mro-error-handler';
import { loginSuccess } from './user.actions';
import { User } from './user.modal';
import { MroUtils } from '../common/mro-util';


export const loginEpic=(action$:ActionsObservable<Action>,store:Store<AppState>,deps:EpicDependencies)=>
action$.ofType(UserActions.LOGIN_ACTION)
.switchMap((action:UserActions.LoginAction)=>{
  const loading=deps.loading.create({
    content:'登录中...'
  });
  loading.present();
    return deps.http.post(deps.mroApis.loginApi,action.userInfo)
    .do(()=>loading.dismiss())
    .map(res=>loginSuccess(res.json().data as User))
    .catch((e:Error)=>{
      const err = new MroError(MroErrorCode.user_login_error_code,`登录失败,${e.message}`,JSON.stringify(e));
      return Observable.of(generateMroError(err));
    });
})
