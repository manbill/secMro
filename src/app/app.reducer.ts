import { initUserState } from './../user/user.actions';
import { ActionsObservable } from 'redux-observable';
import { INIT_APP_STORE, InitAppStoreAction, SET_NAV_CTRL, SetNavCtrlAction } from './app.actions';
import { LoadingController, NavController } from 'ionic-angular';
import { createEpicMiddleware } from 'redux-observable';
import { ProjectState, ProjectReducer, rootProjectEpic } from './../project/project.reducer';
import { combineEpics, Epic } from 'redux-observable';
import { AppState } from './app.reducer';
import { DbOperationProvider } from './../providers/db-operation/db-operation';
import { Http } from '@angular/http';
import { Reducer, combineReducers, compose, Action, Store } from "redux";
import { UserState, RootUserReducer, rootUserEpic } from '../user/user.reducer';
import { CompanyState } from "../company/company.reducer";
import { WorkOrdersState } from "../work-orders/work-orders.reducer";
import { NotificationOrdersState } from "../notification-order/notification-order.reducer";
import { CompanyReducer, rootCompanyEpic } from '../company/company.reducer';

export interface AppState {
  currentUser: UserState,//当前登录用户,
  navCtrl: NavControllerState,
  // workOrders:WorkOrdersState,//工单模块(计划工单、技改工单、安装调试、故障工单),
  // notificationOrders:NotificationOrdersState,//通知单
}
export interface NavControllerState {
  navCtrl: NavController;
}
export function navControllerReducer(state: NavControllerState=null, action: Action): NavControllerState {
  switch (action.type) {
    default: {
      return state;
    }
    case INIT_APP_STORE: {
      console.log((<InitAppStoreAction>action).nav);
      return {
        navCtrl: (<InitAppStoreAction>action).nav
      }
    }
    case SET_NAV_CTRL: {
      return {
        navCtrl: (<SetNavCtrlAction>action).nav
      }
    }
  }
}
export const initStoreEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(INIT_APP_STORE)
    .map((action: InitAppStoreAction) =>
      initUserState(action.userSate)
    )
}
export const rootReducer: Reducer<AppState> = combineReducers<AppState>({
  navCtrl: navControllerReducer,
  currentUser: RootUserReducer,//当前登录用户状态，包括项目，公司等状态
  // workOrders:WorkOrdersState,//工单模块(计划工单、技改工单、安装调试、故障工单),
  // notificationOrders:NotificationOrdersState,//通知单
})
export interface EpicDependencies {
  http: Http,
  dbOperation: DbOperationProvider,
  loadingCtrl: LoadingController
}
export const rootEpic = combineEpics(...[rootUserEpic, rootProjectEpic, rootCompanyEpic]);
