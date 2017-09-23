import { LOGIN_ACTION, LOGIN_SUCCESS } from './../user/user.actions';
import { MroError } from './mro-error';
import { BusinessDataSyncActions } from './../business-data/business.actions';
import { Action } from 'redux';
export const INIT_APP_STATE = 'init_App_State';
import * as DirctionaryActions from '../base-data/dictionary/dictionary.actions';
import * as MaterialActions from '../base-data/material/material.actions';
import * as IntructorActions from "../base-data/manual-instructor/instructor.actions";
import * as WarehouseActions from "../base-data/warehouse/warehouse.actions";
import * as FanMachineActions from "../business-data/fan-equipments/fan.actions";
import * as NotificationActions from "../business-data/notification-order/notification-order.actions";
import { BaseDataSyncActions } from '../base-data/base-data.actions';
export const GENERATE_MRO_ERROR='generate_mro_error';
export const HANDLING_ERROR="handling_error";
export const HANDLDLED_ERROR_COMPLETED="handldled_error_completed";
export const HTTP_RUNNING='http_running';
export const HTTP_RUN_COMPLETED='http_run_completed';
export const CANCEL_ANY_HTTP_REQUEST='cancel_any_http_request';
export function cancelHttpRequest():Action{
  return {
    type:CANCEL_ANY_HTTP_REQUEST
  }
}
export const HTTP_RUNNING_ACTIONS=[
  ...BaseDataSyncActions,
  ...BusinessDataSyncActions,
  LOGIN_ACTION
]
export const HTTP_RUNNING_COMPLETED_ACTIONS=[
  LOGIN_SUCCESS,
  MaterialActions.FETCH_MATERIAL_DATA_COMPLETED,
  DirctionaryActions.FETCH_DICTIONARY_DATA_COMPLETED,
  IntructorActions.FETCH_MANUAL_INSTRUCTOR_DATA_COMPLETED,
  WarehouseActions.FETCH_WAREHOUSE_COMPLETE,
  FanMachineActions.FETCH_FAN_MACHINE_EQUIPMENTS_DATA_COMPLETED
]
export function initAppState(): Action {
  return {
    type: INIT_APP_STATE
  }
}
export function httpRunning(action:string):HttpRunStateAction{
  return {
    type:HTTP_RUNNING,
    actionName:action
  }
}
export interface HttpRunStateAction extends Action{
  actionName:string;
}
export function httpRunCompleted(action:string):HttpRunStateAction{
  return {
    type:HTTP_RUN_COMPLETED,
    actionName:action
  }
}
export const eamSyncActionEntities = BaseDataSyncActions.concat(BusinessDataSyncActions).reduce((entities, action) => {
  entities[action] = action;
  return entities;
}, {});
export function handlingErrors():Action{
  return {
    type:HANDLING_ERROR
  }
}
export function errorsHandledCompleted():Action{
  return {
    type:HANDLDLED_ERROR_COMPLETED
  }
}
export interface GenerateMroErrorAction extends Action{
  error:MroError
}
export function generateMroError(e:MroError):GenerateMroErrorAction{
  return {
    type:GENERATE_MRO_ERROR,
    error:e
  }
}
