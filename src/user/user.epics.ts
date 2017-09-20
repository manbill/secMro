import { AppState } from './../app/app.reducer';
import { tableNames } from './../providers/db-operation/mro.tables';
import { SELECT_PROJECT } from './../project/project.actions';
import { ActionsObservable } from 'redux-observable';
import { EpicDependencies } from '../app/app.reducer';
import { Store, Action } from 'redux';
import * as UserActions from "./user.actions";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs/Observable';
import { MroError, MroErrorCode, generateMroError } from '../app/mro-error-handler';
import { loginSuccess, LOGIN_SUCCESS } from './user.actions';
import { User } from './user.modal';
import { MroUtils } from '../common/mro-util';
import { MroResponse } from '../common/mro-response';
export const loginEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(UserActions.LOGIN_ACTION)
    .switchMap(action => {
      console.log(action)
      const loading = deps.loading.create({
        content: '登录中...'
      });
      loading.present();
      return deps.http.post(deps.mroApis.loginApi, (<UserActions.LoginAction>action).userInfo)
        .finally(() => loading.dismiss())
    })
    .do(res => console.log(res))
    .map((res: MroResponse) => {
      return loginSuccess(res.data)
    })
    .do(res => console.log(res))
    .catch((e: Error) => {
      console.error(e);
      const err = new MroError(MroErrorCode.user_login_error_code, `登录失败`, JSON.stringify(e));
      return Observable.throw(generateMroError(err));
    });
}
export const setUserStateEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(SELECT_PROJECT, LOGIN_SUCCESS)
    .switchMap(() => {
      const loading = deps.loading.create({
        content: "缓存用户状态..."
      });
      loading.present();
      const user: User = store.getState().userState.currentUser;
      const sqls: any[] = [
        [`delete from ${tableNames.eam_user} where userId=?`, [user.id]]
      ];
      sqls.push([
        `insert into ${tableNames.eam_user}(userId,userStateJson)values(?,?)`, [user.id, JSON.stringify(store.getState().userState)]
      ])
      return deps.db.sqlBatch(sqls)
        .map(() => {
          MroUtils.setLoginUserId(user.id);
          return UserActions.setUserStateComplete();
        })
        .do(() => console.log('缓存用户状态成功', new Date()))
        .catch((e: Error) => {
          console.error(e);
          let err = new MroError(MroErrorCode.user_info_db_upsert_error_code, `删除、更新用户状态信息失败，${e.message}`, JSON.stringify(e));
          return Observable.throw(generateMroError(err));
        })
        .finally(() => loading.dismiss())
    })
}
