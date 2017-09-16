import { Action } from 'redux';
export const INIT_APP_STATE = 'init_App_State';
import * as DirctionaryActions from '../base-data/dictionary/dictionary.actions';
import * as MaterialActions from '../base-data/material/material.actions';
import { BaseDataSyncActions } from '../base-data/base-data.actions';
import { BusinessDataSyncActions } from '../business-data/business.actions';
export function initAppState(): Action {
  return {
    type: INIT_APP_STATE
  }
}
export const eamSyncActionEntities = BaseDataSyncActions.concat(BusinessDataSyncActions).reduce((entities, action) => {
  entities[action] = action;
  return entities;
}, {});
