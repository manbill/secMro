import { Project } from './../project/project.modal';
import { tableNames } from './../providers/db-operation/mro.tables';
import { EpicDependencies, AppState } from './../app/app.reducer';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { MroError, MroErrorCode, generateMroError } from './../app/mro-error-handler';
import { Http } from '@angular/http';
import { User } from "./user.modal";
import { Action, Store } from "redux";
import * as UserActions from "./user.actions";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { ActionsObservable, combineEpics, Epic } from "redux-observable";
import * as Apis from "../providers/api/api";
import { inspect } from "util";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import * as ProjectActions from "../project/project.actions";
export interface UserState {
  currentUser: User;
  isTokenValid: boolean;
  isFetching: boolean;
}
export const UserReducer = function (state: UserState = null, action: Action): UserState {
  switch (action.type) {
    case UserActions.SET_CURRENT_USER: {
      const user = (<UserActions.SetCurrentUserAction>action).user;
      return {
        ...state,
        currentUser: user
      }
    }
    default: {
      return state
    }
  }
}
const userLoginEpic: Epic<Action, AppState, EpicDependencies> = (action$: ActionsObservable<Action>, store, deps: EpicDependencies) => {
  return action$.ofType(UserActions.LOGIN_USER)
    .switchMap((action: UserActions.UserLoginAction) => {
      inspect({ ...action.payload })
      const loading = deps.loadingCtrl.create({
        content:'正在登陆...'
      });
      loading.present();
      return deps.http.post(Apis.Api_login, action.payload)
        .do(()=>loading.dismiss())
        .map(res => UserActions.setCurrentUser(res.json().data as User))
        .catch((e: Error) => {
          console.error(e);
          loading.dismiss();
          let err = new MroError(MroErrorCode.user_login_error_code, `用户登陆失败,${e.message}`, inspect(e))
          return Observable.of(generateMroError(err));
        })
    }

    )
}
const setUserInfoEpic: Epic<Action, AppState, EpicDependencies> = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(UserActions.SET_CURRENT_USER)
    .switchMap((action) => {
      console.log("set User")
      const sqls: any[] = [`delete from ${tableNames.eam_user}`];
      const user = store.getState().currentUser;
      sqls.push([`insert into ${tableNames.eam_user}(
        userJson,
        lastLoginTime,
        userId
      )values(?,?,?)`,
      [JSON.stringify(user.currentUser), Date.now(), user.currentUser.id]
      ])
      const loading = deps.loadingCtrl.create({
        content:'正在写入用户信息到数据库...'
      });
      loading.present();
      return deps.dbOperation
        .sqlBatch(sqls)
        .do(()=>loading.dismiss())
        .mapTo(ProjectActions.fetchProjects())
        .catch((e: Error) => {
          console.error(e);
          loading.dismiss();
          let err = new MroError(MroErrorCode.user_info_db_upsert_error_code, `用户信息删除/写入数据库失败,${e.message}`, inspect(e))
          return Observable.of(generateMroError(err));
        })
    })
}
export const rootUserEpic = combineEpics(...[userLoginEpic, setUserInfoEpic]);
