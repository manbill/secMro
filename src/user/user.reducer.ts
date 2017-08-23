import { User } from "./user.modal";
import { Action } from "redux";
import * as UserActions from "./user.actions";
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from "redux-observable";

export interface UserState {
  currentUser: User;
  isTokenValid:boolean;
  isFetching:boolean;
}
export const UserReducer = function (state: UserState, action: Action): UserState {
  switch (action.type) {
    case UserActions.SET_CURRENT_USER: {
      const user = (<UserActions.SetCurrentUserAction>action).user;
      return {
        ...state,
        currentUser: user
      }
    }
    case UserActions.LOGIN_USER:{
      return {
        ...state,
        isFetching:true
      }
    }
    case UserActions.IS_TOKEN_VALID:{
      return {
        ...state,
        isTokenValid:false
      }
    }
    default: {
      return state
    }
  }
}
export const setCurUserEpic=(actions$:ActionsObservable<Action>,store):Observable<Action>=>actions$
.ofType(UserActions.SET_CURRENT_USER)
.switchMap()
.mapTo()
