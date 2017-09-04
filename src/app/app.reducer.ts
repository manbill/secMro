import { BaseDataReducer, RootBaseDataEpics, BaseDataState } from './../base-data/base-data.reducer';
import { FormGroup } from '@angular/forms';
import { WarehouseState, WarehouseReducer, RootWarehouseEpics } from './../warehouse/warehouse.reducer';
import { Warehouse } from './../warehouse/warehouse.modal';
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
export interface AppState{
  userState:UserState,
  baseDataState:BaseDataState,
  warehouseState:WarehouseState,
}
export interface EpicDependencies{
  http:Http;
  db:DbOperationProvider;
  loading:LoadingController;
  mroApis:MroApiEntities;
  alterCtrl:AlertController,
  errorHandler:ErrorHandler
}
export  const RootReducer=combineReducers({
  userState:UserRootReducer,
  baseDataState:BaseDataReducer,
  warehouseState:WarehouseReducer
});
export const RootEpics=combineEpics(RootUserEpics,errorHandleEpic,RootWarehouseEpics,RootBaseDataEpics);
