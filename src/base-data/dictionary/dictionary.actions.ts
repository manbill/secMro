import { DictionaryState } from './dictionary.reducer';
import { Dictionary } from './dictionary.modal';
import { Action } from 'redux';
export const FETCH_DICTIONARY_DATA = "fetch_dictionary_data";
export const FETCH_DICTIONARY_DATA_COMPLETED = "fetch_dictionary_data_completed";
export const INIT_DICTIONARY_STATE = 'init_dictionary_state';
export function fetchDictionaryData(): Action {
  return {
    type: FETCH_DICTIONARY_DATA
  }
}
export interface InitDictionaryStateAction extends Action {
  state: DictionaryState
}
export interface FetchDictionaryCompletedAction extends Action {
  dictionaries: Dictionary[];
}
export function fetchdictionarycompleted(dictionaries: Dictionary[]): FetchDictionaryCompletedAction {
  return {
    type: FETCH_DICTIONARY_DATA_COMPLETED,
    dictionaries: dictionaries
  }
}
export function initDictionaryState(state: DictionaryState): InitDictionaryStateAction {
  return {
    type: INIT_DICTIONARY_STATE,
    state: state
  }
}
