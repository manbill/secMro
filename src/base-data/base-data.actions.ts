import { FETCH_DICTIONARY_DATA } from './dictionary/dictionary.actions';
import { FETCH_MATERIAL_DATA } from './material/material.actions';
import { Action } from 'redux';
export const BASE_DATA_SYNC_COMPLETED = 'base_data_sync_completed';
export const BaseDataSyncActions = [
  FETCH_DICTIONARY_DATA,
  FETCH_MATERIAL_DATA
]
export function baseDataSyncComplete(): Action {
  return {
    type: BASE_DATA_SYNC_COMPLETED
  }
}
export const BaseDataStateTypes={
  'materials_state':'materials_state',
  'dictionary_state':'dictionary_state',
  'manual_state':'manual_state',
  'warehouse_state':'warehouse_state'
}
