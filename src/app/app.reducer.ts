import { AppState, HttpRunningState } from './app.reducer';
import * as AppActions from './app.actions';
import { BusinessDataState, BusinessDataReducer, RootBusinessEpics } from './../business-data/business.reducer';
import { BaseDataReducer, RootBaseDataEpics, BaseDataState } from './../base-data/base-data.reducer';
import { FormGroup } from '@angular/forms';
import { WarehouseState, WarehouseReducer, RootWarehouseEpics } from './../base-data/warehouse/warehouse.reducer';
import { Warehouse } from '../base-data/warehouse/warehouse.modal';
import { errorHandleEpic, httpRunCompletedEpic, httpRunningEpic } from './app.epics';
import { Http } from '@angular/http';
import { DbOperationProvider } from '../providers/db-operation/db-operation';
import { LoadingController, AlertController } from 'ionic-angular';
import { UserState, UserRootReducer, RootUserEpics } from '../user/user.reducer';
import { combineReducers, Action } from 'redux';
import { MroApiEntities } from '../providers/mro-api/mro-api';
import { combineEpics } from 'redux-observable';
import { HttpInterceptorService } from "ng-http-interceptor";
import { ErrorHandler } from '@angular/core';
import { createSelector } from "reselect";
import * as moment from "moment/moment";
import { MroError } from './mro-error';
export interface EpicDependencies {
  http: Http;
  db: DbOperationProvider;
  loading: LoadingController;
  mroApis: MroApiEntities;
  alterCtrl: AlertController,
  pagination: number;
}
export interface MroErrorMessageState {
  errorCodes: number[];
  errorEntities: {
    [errorCode: number]: MroError;
  };
}
export interface HttpRunningStateEntities {
  [action: string]: {
    httpIsRunning: boolean;
  }
}
export interface HttpRunningState {
  actions: string[];
  entities: HttpRunningStateEntities;
}
export interface AppState {
  userState: UserState;
  baseDataState: BaseDataState;
  businessDataState: BusinessDataState;
  mroErrorMessage: MroErrorMessageState;
  httpRunning: HttpRunningState;
}
export const RootReducer = combineReducers({
  userState: UserRootReducer,
  baseDataState: BaseDataReducer,
  businessDataState: BusinessDataReducer,
  mroErrorMessage: MroErrorMessageReducer,
  httpRunning: HttpRunningReducer
});
export function HttpRunningReducer(state: HttpRunningState = {
  actions: [],
  entities: {}
}, action: Action): HttpRunningState {
  switch (action.type) {
    default: {
      return state;
    }
    case AppActions.HANDLDLED_ERROR_COMPLETED:
    case AppActions.CANCEL_ANY_HTTP_REQUEST: {
      return {
        ...state,
        actions: [],
        entities: {}
      }
    }
    case AppActions.HTTP_RUNNING: {
      const actionName = (<AppActions.HttpRunStateAction>action).actionName;
      return {
        ...state,
        actions: [...state.actions, actionName],
        entities: Object.assign({}, state.entities, { [actionName]: true })
      }
    }
    case AppActions.HTTP_RUN_COMPLETED: {
      const actionName = (<AppActions.HttpRunStateAction>action).actionName;
      return {
        ...state,
        actions: [...state.actions, actionName],
        entities: Object.assign({}, state.entities, { [actionName]: false })
      }
    }
  }
}
export function MroErrorMessageReducer(state: MroErrorMessageState = {
  errorCodes: [],
  errorEntities: {}
}, action: Action): MroErrorMessageState {
  switch (action.type) {
    default:
      return state;
    case AppActions.GENERATE_MRO_ERROR: {
      const error = (<AppActions.GenerateMroErrorAction>action).error;
      console.error(error);
      const errorCode = error.errorCode;
      return {
        ...state,
        errorCodes: [...state.errorCodes, error.errorCode],
        errorEntities: Object.assign({}, state.errorEntities, { [errorCode]: error })
      }
    }
    case AppActions.HANDLDLED_ERROR_COMPLETED: {
      return {
        ...state,
        errorCodes: [],
        errorEntities: {}
      }
    }
  }
}
export function getHttpState(state: AppState): HttpRunningState {
  return state.httpRunning;
}
export function getMroErrorMessages(state: AppState): MroError[] {
  return Object.keys(state.mroErrorMessage.errorEntities).map(key => state.mroErrorMessage.errorEntities[key]);
}
export const RootEpics = combineEpics(RootUserEpics, errorHandleEpic, httpRunningEpic, httpRunCompletedEpic, RootWarehouseEpics, RootBaseDataEpics, RootBusinessEpics);
const isLoginAsPerTime = (state: AppState) => {//不是同一天，需要重新登录
  // console.log('moment(state.userState.lastLoginTime)',moment(state.userState.lastLoginTime).date());
  // console.log('moment().date()', moment().date());
  return moment(state.userState.lastLoginState.lastLoginTime).date() !== moment().date();
}
const allBaseDataCompleted = (state: AppState) => {
  return Object.keys(state.baseDataState).every((baseState) => {
    console.log('baseDataState:every: ', state.baseDataState[baseState]['isCompleted']);
    return state.baseDataState[baseState]['isCompleted'];
  })
}
export const shouldLogin = createSelector(allBaseDataCompleted, isLoginAsPerTime, (stat, isLogin) => { console.log(`基础数据是否已经完成：${stat}，今天是否首次使用，需要登录:${isLogin}`); return !stat || isLogin })
