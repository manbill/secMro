import { User } from "./user.modal";
import { Action } from "redux";
import * as UserActions from "./user.actions";
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
