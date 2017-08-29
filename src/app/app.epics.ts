import { Observable } from 'rxjs/Observable';
import { AppState, EpicDependencies } from './app.reducer';
import { ActionsObservable } from 'redux-observable';
import {  Store,Action} from "redux";
import 'rxjs/add/observable/of';
import * as HandleErrorActions from "./mro-error-handler";
import { GENERATE_MRO_ERROR,GenerateMroErrorAction } from "./mro-error-handler";
export const errorHandleEpic=(action$:ActionsObservable<Action>,store:Store<AppState>,deps:EpicDependencies)=>{
  return action$.ofType(GENERATE_MRO_ERROR)
  .switchMap((action:HandleErrorActions.GenerateMroErrorAction)=>{
      const loading = deps.loading.create({
        content:action.error.errorMessage,
        duration:1000*60,
        spinner: 'hide',
        enableBackdropDismiss:true,
        cssClass:'error'
      });
      loading.present();
      console.error(action.error);
      return Observable.of(HandleErrorActions.errorHandled());
  })
}
