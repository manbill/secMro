import { LoadingController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { DbOperationProvider } from './../providers/db-operation/db-operation';
import { Http } from '@angular/http';
import { createStore, Store, compose, StoreEnhancer, applyMiddleware } from "redux";
import { AppState, rootReducer, rootEpic } from "./app.reducer";
import { InjectionToken, Provider } from "@angular/core";
import { createEpicMiddleware } from "redux-observable";
export const AppStore = new InjectionToken('App.store');
import { EpicDependencies } from "./app.reducer";
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
export function createAppStore(deps: EpicDependencies): Store<AppState> {
  return createStore(rootReducer,
    composeEnhancers(
      applyMiddleware(
        createEpicMiddleware(rootEpic, {
          dependencies: deps
        })
      )
    )
  );
}
export const AppStoreProvider: Provider = {
  provide: AppStore,
  useFactory: (http: Http, sqlite: DbOperationProvider,loadingCtrl:LoadingController) => createAppStore(
    {
      http: http,
      dbOperation: sqlite,
      loadingCtrl:loadingCtrl
    }
  ),
  deps: [Http, DbOperationProvider,LoadingController]
}
