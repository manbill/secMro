import { LoadingController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { createEpicMiddleware } from 'redux-observable';
import { ProjectState ,ProjectReducer,rootProjectEpic} from './../project/project.reducer';
import { combineEpics,Epic } from 'redux-observable';
import { AppState } from './app.reducer';
import { DbOperationProvider } from './../providers/db-operation/db-operation';
import { Http } from '@angular/http';
import { Reducer,combineReducers,compose,Action } from "redux";
import { UserState, UserReducer,rootUserEpic } from '../user/user.reducer';
import { CompanyState } from "../company/company.reducer";
import { WorkOrdersState } from "../work-orders/work-orders.reducer";
import { NotificationOrdersState } from "../notification-order/notification-order.reducer";
import { CompanyReducer,rootCompanyEpic } from '../company/company.reducer';
export interface AppState{
  currentUser:UserState,//当前登录用户
  projects:ProjectState,//当前选择的项目
  currentCompany:CompanyState,//当前选择的公司
  // workOrders:WorkOrdersState,//工单模块(计划工单、技改工单、安装调试、故障工单),
  // notificationOrders:NotificationOrdersState,//通知单
}
export const rootReducer:Reducer<AppState >=combineReducers<AppState>({
  currentUser:UserReducer,//当前登录用户
  projects:ProjectReducer,//当前选择的项目
  currentCompany:CompanyReducer,//当前选择的公司
  // workOrders:WorkOrdersState,//工单模块(计划工单、技改工单、安装调试、故障工单),
  // notificationOrders:NotificationOrdersState,//通知单
})
export interface EpicDependencies{
  http:Http,
  dbOperation:DbOperationProvider,
  loadingCtrl:LoadingController
}
export const rootEpic=combineEpics(...[rootUserEpic,rootProjectEpic,rootCompanyEpic]);
