import { tableNames } from './../providers/db-operation/mro.tables';
import { SELECT_PROJECT } from './../project/project.actions';
import { ActionsObservable } from 'redux-observable';
import { AppState, EpicDependencies } from '../app/app.reducer';
import { Store, Action } from 'redux';
import * as UserActions from "./user.actions";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { MroError, MroErrorCode, generateMroError } from '../app/mro-error-handler';
import { loginSuccess } from './user.actions';
import { User } from './user.modal';
import { MroUtils } from '../common/mro-util';
import { MroResponse } from '../common/mro-response';


export const loginEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(UserActions.LOGIN_ACTION)
    .switchMap((action: UserActions.LoginAction) => {
      console.log(`用户登录action`,action.userInfo);
      const loading = deps.loading.create({
        content: '登录中...'
      });
      loading.present();
      return deps.http.post(deps.mroApis.loginApi, action.userInfo)
        .map((res:MroResponse) => loginSuccess(res.data as User))
        .catch((e: Error) => {
          console.error(e);
          loading.dismiss();
          const err = new MroError(MroErrorCode.user_login_error_code, `登录失败`, JSON.stringify(e));
          return Observable.of(generateMroError(err));
        });
    });
}
export const setUserStateEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(SELECT_PROJECT)
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
        .do(() => loading.dismiss())
        .mapTo(UserActions.setUserStateComplete())
        .catch((e:Error)=>{
          loading.dismiss();
          console.error(e);
          let err =new MroError(MroErrorCode.user_info_db_upsert_error_code,`删除、更新用户状态信息失败，${e.message}`,JSON.stringify(e));
          return Observable.of(generateMroError(err));
        })
    })
}
