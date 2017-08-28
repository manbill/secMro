import { InjectionToken, Provider } from '@angular/core';
import { DbOperationProvider } from '../providers/db-operation/db-operation';
import { EpicDependencies, RootReducer, AppState, RootEpics } from './app.reducer';
import { compose, createStore, applyMiddleware, Store } from 'redux';
import { createEpicMiddleware } from "redux-observable";
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { MroApiProvider } from '../providers/mro-api/mro-api';
const composeEnhancer = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
export const AppStore = new InjectionToken("Mro.App.Store");
export function createMroAppStore(http: Http, sqlite: DbOperationProvider, loading: LoadingController,api:MroApiProvider) {
  const deps: EpicDependencies = {
    db: sqlite,
    http: http,
    loading: loading,
    mroApis:api.mroApiEntities
  };
  const store: Store<AppState> = createStore(RootReducer, composeEnhancer(
    applyMiddleware(
      createEpicMiddleware(RootEpics, { dependencies: deps })
    )
  )
  )
  return store;
}
export const MroAppStoreProvider: Provider = {
  provide: AppStore,
  useFactory: (http, sqlite, loading,api) => createMroAppStore(http, sqlite, loading,api),
  deps: [Http, DbOperationProvider, LoadingController,MroApiProvider]
}
