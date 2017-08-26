import { MroError,MroErrorCode } from './../app/mro-error-handler';
import { Action, ActionCreator } from "redux";
import { User } from "./user.modal";
export const SET_CURRENT_USER = '[User] Set Current';
export const LOGIN_USER = '[User] login ';
export const LOGIN_USER_FAILED = '[User] login failed';
export const IS_TOKEN_VALID = '[User] is token valid ';
export interface SetCurrentUserAction extends Action {
  user: User
}
export interface LoginInfo{
  userName:string,
  password:string,
  deviceFlag:number
}
export interface UserLoginAction extends Action {
  payload:LoginInfo
}
export const setCurrentUser: ActionCreator<SetCurrentUserAction> = (user) => ({
  type: SET_CURRENT_USER,
  user: user
});
export const userLogin:ActionCreator<UserLoginAction>=(payload:LoginInfo)=>({
  type:LOGIN_USER,
  payload:payload
})
interface LoginFailedAction extends Action{
  error:MroError
}
export const userLoginFailed:ActionCreator<LoginFailedAction>=(error:MroError)=>({
  type:LOGIN_USER_FAILED,
  error:error
})
