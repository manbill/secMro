import { Action, ActionCreator } from "redux";
import { User } from "./user.modal";
export const SET_CURRENT_USER = '[User] Set Current';
export const LOGIN_USER = '[User] login ';
export const IS_TOKEN_VALID = '[User] is token valid ';
export interface SetCurrentUserAction extends Action {
  user: User
}
export interface FetchUserAction extends Action {
  username:string,
  password:string,
  flag:number
}
export interface IsTokenValid extends Action {
  isValid:boolean
}
export const setCurrentUser: ActionCreator<SetCurrentUserAction> = (user) => ({
  type: SET_CURRENT_USER,
  user: user
});
export const isTokenVali:ActionCreator<IsTokenValid> = (isValid:boolean) => ({
  type: IS_TOKEN_VALID,
  isValid: isValid
});
export const fetchUser:ActionCreator<FetchUserAction>=({password,userName,flag=2})=>({
  type:LOGIN_USER,
  username:userName,
  password:password,
  flag:flag
})
