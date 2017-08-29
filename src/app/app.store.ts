import { Observable } from 'rxjs/Observable';
import { HttpInterceptorService } from 'ng-http-interceptor';
import { InjectionToken, Provider } from '@angular/core';
import { DbOperationProvider } from '../providers/db-operation/db-operation';
import { EpicDependencies, RootReducer, AppState, RootEpics } from './app.reducer';
import { compose, createStore, applyMiddleware, Store } from 'redux';
import { createEpicMiddleware } from "redux-observable";
import { Http, RequestOptions } from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';
import { MroApiProvider } from '../providers/mro-api/mro-api';
import { MroUtils } from '../common/mro-util';

const composeEnhancer = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
export const AppStore = new InjectionToken("Mro.App.Store");
export function createMroAppStore(http: Http, sqlite: DbOperationProvider, loading: LoadingController,api:MroApiProvider,interceptor:HttpInterceptorService, alterCtrl:AlertController) {
  const deps: EpicDependencies = {
    db: sqlite,
    http: http,
    loading: loading,
    mroApis:api.mroApiEntities,
    alterCtrl:alterCtrl
  };
  const store: Store<AppState> = createStore(RootReducer, composeEnhancer(
    applyMiddleware(
      createEpicMiddleware(RootEpics, { dependencies: deps })
    )
  )
  )
  interceptor.request().addInterceptor((data,method)=>{
    const url:string = data[0];
    const reqOpts:RequestOptions=data[2];
    if(url&&url.includes('/api')){
      data[2]=Object.assign({},reqOpts,MroUtils.generatePostReqArgs(store.getState().userState.currentUser.token));
    };
    const reqObj = {
      url:data[0],
      method:method,
      data:data[1],
      token:store.getState().userState.currentUser?store.getState().userState.currentUser.token:null,
      dateTime:new Date()
    };
    console.debug(method,reqObj);
    return data;
  })
  interceptor.response().addInterceptor(
    (res, method) => {
      return res.map(r => {
        console.log(method, {
          responseDateTime:new Date(),
          response:r.json()
        });
        if(r.json().retCode!=='00000'){
          throw(r.json().retInfo||"网络请求失败!");
        }
        return r.json();
      });
    }
  );
  return store;
}
export const MroAppStoreProvider: Provider = {
  provide: AppStore,
  useFactory: (http, sqlite, loading,api,interceptor,alterCtrl) => createMroAppStore(http, sqlite, loading,api,interceptor, alterCtrl),
  deps: [Http, DbOperationProvider, LoadingController,MroApiProvider,HttpInterceptorService,AlertController]
}
