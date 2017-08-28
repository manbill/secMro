import { Http } from '@angular/http';
import { DbOperationProvider } from '../providers/db-operation/db-operation';
import { LoadingController } from 'ionic-angular';
import { UserState, UserRootReducer, RootUserEpics } from '../user/user.reducer';
import { combineReducers } from 'redux';
import { MroApiEntities } from '../providers/mro-api/mro-api';
import { combineEpics } from 'redux-observable';
export interface AppState{
  userState:UserState
}
export interface EpicDependencies{
  http:Http;
  db:DbOperationProvider;
  loading:LoadingController;
  mroApis:MroApiEntities;
}
export  const RootReducer=combineReducers({
  userState:UserRootReducer
});
export const RootEpics=combineEpics(...[RootUserEpics]);
