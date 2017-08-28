import { Observable } from 'rxjs/Observable';
import { HttpInterceptorService } from 'ng-http-interceptor';
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
export function createMroAppStore(http: Http, sqlite: DbOperationProvider, loading: LoadingController,api:MroApiProvider,interceptor:HttpInterceptorService) {
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
  interceptor.request().addInterceptor((data,method,args)=>{
    console.debug(method,data,args);
    return data;
  })
  interceptor.response().addInterceptor(
    (res, method) => {
      return res.map(r => {
        console.log(method, r.json());
        if(r.json().retCode!=='00000'){
          throw(r.json().retInfo||"网络请求失败!");
        }
        return r
      });
    }
  );
  return store;
}
export const MroAppStoreProvider: Provider = {
  provide: AppStore,
  useFactory: (http, sqlite, loading,api,interceptor) => createMroAppStore(http, sqlite, loading,api,interceptor),
  deps: [Http, DbOperationProvider, LoadingController,MroApiProvider,HttpInterceptorService]
}
