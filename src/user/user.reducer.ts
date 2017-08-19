import { User } from "./user.modal";
import { Action } from "redux";
import * as UserActions from "./user.actions";
export interface UserState {
  currentUser: User;
}
export const UserReducer = function (state: UserState, action: Action): UserState {
  switch (action.type) {
    case UserActions.SET_CURRENT_USER: {
      const user = (<UserActions.SetCurrentUserAction>action).user;
      return {
        currentUser: user
      }
    }
    default: {
      return state
    }
  }
}
