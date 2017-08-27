import { UserState } from './../user/user.reducer';
import { NavController } from 'ionic-angular';
import { ActionCreator } from 'redux';
import { AppState } from './app.reducer';
import { Action } from 'redux';
export const INIT_APP_STORE = 'init_app_store';
export const SET_NAV_CTRL="set_nav_ctrl";
export interface SetNavCtrlAction extends Action{
  nav:NavController;
}
export interface InitAppStoreAction extends Action {
  nav: NavController,
  userSate:UserState
}
export function setNavCtrl(nav:NavController):SetNavCtrlAction{
 return {
   type:SET_NAV_CTRL,
   nav:nav
 }
}
export const initAppStore: ActionCreator<InitAppStoreAction> = (nav: NavController,userSate:UserState) => ({
  type: INIT_APP_STORE,
  nav: nav,
  userSate:userSate
});
