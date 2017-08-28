import { Action } from 'redux';
export const INIT_APP_STATE='init_App_State';
export function initAppState():Action{
  return {
    type:INIT_APP_STATE
  }
}
