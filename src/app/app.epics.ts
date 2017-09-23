import { BusinessDataSyncActions } from './../business-data/business.actions';
import { Observable } from 'rxjs/Observable';
import { AppState, EpicDependencies } from './app.reducer';
import { ActionsObservable } from 'redux-observable';
import { Store, Action } from "redux";
import 'rxjs/add/observable/of';
import * as HandleErrorActions from "./app.actions";
import * as AppActions from './app.actions';
import { AppStore } from './app.store';
import 'rxjs/add/operator/mergeMap';
import { MroErrorCode } from './mro-error';
import { getMroErrorMessages } from "./app.reducer";
export const errorHandleEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(AppActions.HANDLING_ERROR)
    .switchMap(() => {
      const errorMessage = getMroErrorMessages(store.getState());
      console.error(errorMessage);
      if (errorMessage.length > 0) {
        const errorAlert = deps.alterCtrl.create({
          title: '错误提示',
          subTitle: '错误信息',
          message: `${errorMessage.map(e => e.errorMessage + "<br/>")}`,
          buttons: [{
            text: '确定',
            handler: () => {
              console.log('错误处理,完成');
            }
          }, {
            text: '取消',
            role: 'cancel',
            handler: () => {
              console.log('错误处理取消');
            }
          }
          ]
        });
        errorAlert.present();
      }
      return Observable.of(AppActions.errorsHandledCompleted());
    })
}
export const httpRunningEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  //所有的业务数据和基础数据进行网络请求
  return action$.ofType(...AppActions.HTTP_RUNNING_ACTIONS)
    .map(action => {
      console.log(action);
      return AppActions.httpRunning(action.type);
    })
}
export const httpRunCompletedEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(...AppActions.HTTP_RUNNING_COMPLETED_ACTIONS)
    .map(action => {
      return AppActions.httpRunCompleted(action.type);
    })
}
