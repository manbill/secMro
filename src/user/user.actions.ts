import { UserState } from './user.reducer';
import { SetCurrentUserAction } from './user.actions';
import { Company } from './../company/company.modal';
import { MroError,MroErrorCode } from './../app/mro-error-handler';
import { Action, ActionCreator } from "redux";
import { User } from "./user.modal";
export const SET_CURRENT_USER = '[User] Set Current';
export const LOGIN_USER = '[User] login ';
export const LOGIN_USER_FAILED = '[User] login failed';
export const IS_TOKEN_VALID = '[User] is token valid';
export const USER_LOGIN_COMPLETE = 'User Login Complete';
export const CHANGE_COMPANY='change_company';
export const INIT_USER_STATE='init_user_state';
export const INIT_USER_STATE_COMPLETE='init_user_state_complete';
export interface ChangeCompanyAction extends Action{
  company:Company;
}
export const initUserStateComplete:ActionCreator<Action>=()=>({
  type:INIT_USER_STATE_COMPLETE
})
export const changCompany:ActionCreator<ChangeCompanyAction>=(company:Company)=>({
  type:CHANGE_COMPANY,
  company:company
})
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
export interface UserLoginCompleteAction extends Action{
  payload:any
}
export const userLoginComplete:ActionCreator<Action>=(payload:any)=>({
  type:USER_LOGIN_COMPLETE,
  playload:payload
})
export interface InitUserStateAction extends Action{
  userState:UserState
}
export const initUserState:ActionCreator<InitUserStateAction>=(userState:UserState)=>({
  type:INIT_USER_STATE,
  userState:userState
})
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
