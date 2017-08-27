import { initProjectState } from './../project/project.actions';
import { initCompanyState } from './../company/company.actions';
import { Company } from './../company/company.modal';
import { UserState } from './user.reducer';
import { MroUtils } from './../common/mro-util';
import { INIT_APP_STORE, InitAppStoreAction } from './../app/app.actions';
import { CompanyState, CompanyReducer } from './../company/company.reducer';
import { ProjectState, ProjectReducer } from './../project/project.reducer';
import { Project } from './../project/project.modal';
import { tableNames } from './../providers/db-operation/mro.tables';
import { EpicDependencies, AppState } from './../app/app.reducer';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { MroError, MroErrorCode, generateMroError } from './../app/mro-error-handler';
import { Http } from '@angular/http';
import { User } from "./user.modal";
import { Action, Store, combineReducers } from "redux";
import * as UserActions from "./user.actions";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { ActionsObservable, combineEpics, Epic } from "redux-observable";
import * as Apis from "../providers/api/api";
import { inspect } from "util";
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import * as ProjectActions from "../project/project.actions";
export interface UserState {
  currentUser: User;
  userProject: ProjectState
  userCompany: CompanyState
}
export function UserReducer(user: User = null, action: Action): User {
  switch (action.type) {
    case UserActions.SET_CURRENT_USER: {
       user=(<UserActions.SetCurrentUserAction>action).user;
      return user;
    }
    case UserActions.INIT_USER_STATE: {
      let user2=(<InitAppStoreAction>action).userSate.currentUser;
      console.log("UserActions.INIT_USER_STATE",user2);
      if(user2){
        return user2;
      }
      return user;
    }
    default: {
      return user;
    }
  }
}
export const initUserReducerEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(UserActions.INIT_USER_STATE)
    .switchMap((action: InitAppStoreAction) => {
      console.log("初始化，initUserReducerEpic");
      return Observable.from([
        initCompanyState(action.userSate.userCompany),
        initProjectState(action.userSate.userProject)
      ]);
    })
}
export const RootUserReducer = combineReducers({
  currentUser: UserReducer,
  userProject: ProjectReducer,
  userCompany: CompanyReducer,
})
const userLoginEpic: Epic<Action, AppState, EpicDependencies> = (action$: ActionsObservable<Action>, store, deps: EpicDependencies) => {
  return action$.ofType(UserActions.LOGIN_USER)
    .switchMap((action: UserActions.UserLoginAction) => {
      inspect({ ...action.payload })
      const loading = deps.loadingCtrl.create({
        content: '正在登陆...',
        dismissOnPageChange: true
      });
      loading.present();
      return deps.http.post(Apis.Api_login, action.payload)
        .do(() => loading.dismiss())
        .map(res => {
          const user= res.json().data as User;
          MroUtils.setLoginUserId(user.id+"");
          return UserActions.setCurrentUser(user);
        })
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
    .switchMap((action: UserActions.SetCurrentUserAction) => {
      console.log("set User", action.user)
      const sqls: any[] = [[`delete from ${tableNames.eam_user} where  userId=?`, [action.user.id]]];
      const user = action.user;
      sqls.push([`insert into ${tableNames.eam_user}(
        userJson,
        lastLoginTime,
        userId
      )values(?,?,?)`,
      [JSON.stringify(user), Date.now(), user.id]])
      const loading = deps.loadingCtrl.create({
        content: '正在写入用户信息到数据库...',
        dismissOnPageChange: true
      });
      loading.present();
      return deps.dbOperation
        .sqlBatch(sqls)
        .do(() => loading.dismiss())
        .mapTo(ProjectActions.fetchProjects())
        .catch((e: Error) => {
          console.error(e);
          loading.dismiss();
          let err = new MroError(MroErrorCode.user_info_db_upsert_error_code, `用户信息删除/写入数据库失败,${e.message}`, inspect(e))
          return Observable.of(generateMroError(err));
        })
    })
}
export const rootUserEpic = combineEpics(...[userLoginEpic, setUserInfoEpic, initUserReducerEpic]);
