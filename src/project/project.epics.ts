import { ActionsObservable } from 'redux-observable';
import { AppState, EpicDependencies } from '../app/app.reducer';
import { Store, Action } from 'redux';
import { LOGIN_SUCCESS } from "../user/user.actions";
export const fetchProjectsEpic=(action$:ActionsObservable<Action>,store:Store<AppState>,deps:EpicDependencies)=>action$.ofType(LOGIN_SUCCESS)
.switchMap(()=>{

})
