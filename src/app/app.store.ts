import { MroError, MroErrorCode } from './mro-error-handler';
import { Observable } from 'rxjs/Observable';
import { HttpInterceptorService } from 'ng-http-interceptor';
import { InjectionToken, Provider, ErrorHandler } from '@angular/core';
import { DbOperationProvider } from '../providers/db-operation/db-operation';
import { EpicDependencies, RootReducer, AppState, RootEpics } from './app.reducer';
import { compose, createStore, applyMiddleware, Store } from 'redux';
import { createEpicMiddleware } from "redux-observable";
import { Http, RequestOptions } from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';
import { MroApiProvider } from '../providers/mro-api/mro-api';
import { MroUtils } from '../common/mro-util';
import { tokenInvalid } from "../user/user.actions";

const composeEnhancer = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
export const AppStore = new InjectionToken("Mro.App.Store");
export function createMroAppStore(http: Http, sqlite: DbOperationProvider, loading: LoadingController, api: MroApiProvider, interceptor: HttpInterceptorService, alterCtrl: AlertController, errorHandler: ErrorHandler) {
  const deps: EpicDependencies = {
    db: sqlite,
    http: http,
    loading: loading,
    mroApis: api.mroApiEntities,
    alterCtrl: alterCtrl,
    errorHandler: errorHandler,
    pagination:MroUtils.PAGINATION//列表每次展示的条目数量
  };
  const store: Store<AppState> = createStore(RootReducer, composeEnhancer(
    applyMiddleware(
      createEpicMiddleware(RootEpics, { dependencies: deps })
    )
  )
  )
  interceptor.request().addInterceptor((data, method) => {
    // console.debug(data)
    const url: string = data[0];
    const reqOpts: RequestOptions = data[2];
    if (method.toLowerCase() === 'post' && url && url.includes('/api')) {
      data[2] = Object.assign({}, reqOpts, MroUtils.generatePostReqArgs(store.getState().userState.currentUser.token));
    };
    if (method.toLowerCase() === 'get' && url && url.includes('/api')) {
      data[1] = Object.assign({}, reqOpts, MroUtils.generatePostReqArgs(store.getState().userState.currentUser.token));
    };
    const reqObj = {
      url: data[0],
      method: method,
      data: data[1],
      token: store.getState().userState.currentUser ? store.getState().userState.currentUser.token : null,
      requestDateTime: Date.now()
    };
    console.debug('请求拦截', reqObj);
    return data;
  })
  interceptor.response().addInterceptor(
    (res, method) => {
      return res.map(r => {
        console.log("接收拦截", {
          responseDateTime: Date.now(),
          response: r.json()
        });
        if (r.json().retCode === '10008') {
          let err = new MroError(MroErrorCode.token_invalid_error_code, 'token失效，请重新登录', r.json().retInfo);
          // errorHandler.handleError(err);
          store.dispatch(tokenInvalid());
          throw (err);
        }
        if (r.json().retCode !== '00000') {
          let err = new MroError(MroErrorCode.token_invalid_error_code, 'token失效，请重新登录', r.json().retInfo|| "网络请求失败!");
          throw (err);
        }
        return r.json();
      });
    }
  );
  return store;
}
export const MroAppStoreProvider: Provider = {
  provide: AppStore,
  useFactory: (http, sqlite, loading, api, interceptor, alterCtrl, errorHandler) => createMroAppStore(http, sqlite, loading, api, interceptor, alterCtrl, errorHandler),
  deps: [Http, DbOperationProvider, LoadingController, MroApiProvider, HttpInterceptorService, AlertController, ErrorHandler]
}
