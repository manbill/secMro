import { BusinessDataState, BusinessDataReducer, RootBusinessEpics } from './../business-data/business.reducer';
import { BaseDataReducer, RootBaseDataEpics, BaseDataState } from './../base-data/base-data.reducer';
import { FormGroup } from '@angular/forms';
import { WarehouseState, WarehouseReducer, RootWarehouseEpics } from './../base-data/warehouse/warehouse.reducer';
import { Warehouse } from '../base-data/warehouse/warehouse.modal';
import { errorHandleEpic } from './app.epics';
import { Http } from '@angular/http';
import { DbOperationProvider } from '../providers/db-operation/db-operation';
import { LoadingController, AlertController } from 'ionic-angular';
import { UserState, UserRootReducer, RootUserEpics } from '../user/user.reducer';
import { combineReducers } from 'redux';
import { MroApiEntities } from '../providers/mro-api/mro-api';
import { combineEpics } from 'redux-observable';
import { HttpInterceptorService } from "ng-http-interceptor";
import { ErrorHandler } from '@angular/core';
import { createSelector } from "reselect";
import * as moment from "moment/moment";
export interface EpicDependencies {
  http: Http;
  db: DbOperationProvider;
  loading: LoadingController;
  mroApis: MroApiEntities;
  alterCtrl: AlertController,
  errorHandler: ErrorHandler,
  pagination: number;
}
export interface AppState {
  userState: UserState,
  baseDataState: BaseDataState,
  businessDataState: BusinessDataState
}
export const RootReducer = combineReducers({
  userState: UserRootReducer,
  baseDataState: BaseDataReducer,
  businessDataState: BusinessDataReducer
});
export const RootEpics = combineEpics(RootUserEpics, errorHandleEpic, RootWarehouseEpics, RootBaseDataEpics, RootBusinessEpics);
const isLoginAsPerTime = (state: AppState) => {//不是同一天，需要重新登录
  // console.log('moment(state.userState.lastLoginTime)',moment(state.userState.lastLoginTime).date());
  // console.log('moment().date()', moment().date());
  return moment(state.userState.lastLoginTime).date() !== moment().date();
}
const allBaseDataCompleted = (state: AppState) => {
  return Object.keys(state.baseDataState).every((baseState) => {
    console.log('baseDataState:every: ', state.baseDataState[baseState]['isCompleted']);
    return state.baseDataState[baseState]['isCompleted'];
  })
}
export const shouldLogin = createSelector(allBaseDataCompleted, isLoginAsPerTime, (stat, isLogin) => { console.log(`基础数据是否已经完成：${stat}，今天是否首次使用，需要登录:${isLogin}`); return !stat || isLogin })
