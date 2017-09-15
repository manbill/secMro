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
export interface AppState {
  userState: UserState,
  baseDataState: BaseDataState,
}
export interface EpicDependencies {
  http: Http;
  db: DbOperationProvider;
  loading: LoadingController;
  mroApis: MroApiEntities;
  alterCtrl: AlertController,
  errorHandler: ErrorHandler,
  pagination: number;
}
export const RootReducer = combineReducers({
  userState: UserRootReducer,
  baseDataState: BaseDataReducer
});
export const RootEpics = combineEpics(RootUserEpics, errorHandleEpic, RootWarehouseEpics, RootBaseDataEpics);
const isLoginAsPerTime=(state:AppState)=>{
  // console.log('moment(state.userState.lastLoginTime)',moment(state.userState.lastLoginTime).date());
  // console.log('moment().date()',moment().date());
  return moment(state.userState.lastLoginTime).date()!==moment().date()
}
const checkBaseDataDownloadStat=(state:AppState)=>{
  return Object.keys(state.baseDataState).every((baseState)=>{
    console.log('baseDataState:every: ',state.baseDataState[baseState]['isCompleted']);
    return state.baseDataState[baseState]['isCompleted'];
  })
}
export const shouldLogin=createSelector(checkBaseDataDownloadStat,isLoginAsPerTime,(stat,isLogin)=>stat&&isLogin)
