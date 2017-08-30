import { errorHandleEpic } from './app.epics';
import { Http } from '@angular/http';
import { DbOperationProvider } from '../providers/db-operation/db-operation';
import { LoadingController, AlertController } from 'ionic-angular';
import { UserState, UserRootReducer, RootUserEpics } from '../user/user.reducer';
import { combineReducers } from 'redux';
import { MroApiEntities } from '../providers/mro-api/mro-api';
import { combineEpics } from 'redux-observable';
import { HttpInterceptorService } from "ng-http-interceptor";
export interface AppState{
  userState:UserState
}
export interface EpicDependencies{
  http:Http;
  db:DbOperationProvider;
  loading:LoadingController;
  mroApis:MroApiEntities;
  alterCtrl:AlertController,
}
export  const RootReducer=combineReducers({
  userState:UserRootReducer
});
export const RootEpics=combineEpics(RootUserEpics,errorHandleEpic);
