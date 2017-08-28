import { ActionCreator, Action } from 'redux';
import { UserState } from './user.reducer';
import { User } from './user.modal';
export const LOGIN_SUCCESS = 'login_success';
export const INIT_USER_STATE = 'init_user_state';
export const LOGIN_ACTION = 'login_action';
export const SET_USER_STATE_COMPLETE='set_user_state_complete';
export interface UserLoginInfo {
  userName: string;
  password: string;
  deviceFlag: number;
}
export interface LoginAction extends Action {
  userInfo: UserLoginInfo
}
export function login(userInfo: UserLoginInfo): LoginAction {
  return {
    type: LOGIN_ACTION,
    userInfo: userInfo
  }
}
export function setUserStateComplete():Action{
  return {
    type:SET_USER_STATE_COMPLETE
  }
}
export interface LoginSuccessAction extends Action{
  user:User;
}
export function loginSuccess(user:User): LoginSuccessAction {
  return {
    type: LOGIN_SUCCESS,
    user:user
  }
};
export interface InitUserStateAction extends Action {
  userState: UserState
}
export function initUserState(userSate: UserState): InitUserStateAction {
  return {
    type: INIT_USER_STATE,
    userState: userSate
  }
}
