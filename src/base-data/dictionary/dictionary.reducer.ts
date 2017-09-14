import { fetDictionaryDataEpic } from './dictionary.epics';
import { combineEpics } from 'redux-observable';
import { Action } from 'redux';
import { Dictionary } from './dictionary.modal';
import * as DictonaryActions from "./dictionary.actions";
export interface DictionaryEntities {
  [id: number]: Dictionary
}
export interface DictionaryState {
  detailIds: number[],
  dictionaryEntities: DictionaryEntities,
  isCompleted: boolean
}
const initState = { detailIds: null, dictionaryEntities: {}, isCompleted: false };
export const DictionaryReducer = (state: DictionaryState = initState, action: Action): DictionaryState => {
  switch (action.type) {
    default: {
      return state;
    }
    case DictonaryActions.INIT_DICTIONARY_STATE: {
      return (<DictonaryActions.InitDictionaryStateAction>action).state
    }
    case DictonaryActions.FETCH_DICTIONARY_DATA_COMPLETED: {
      const dicts = (<DictonaryActions.FetchDictionaryCompletedAction>action).dictionaries;
      return {
        ...state,
        dictionaryEntities: dicts.reduce((entities, dict) => { entities[dict.detailId] = dict; return entities }, {}),
        detailIds: dicts.map(dict => dict.detailId),
        isCompleted: true
      }
    }
  }
}
export const DictionaryEpics = combineEpics(...[fetDictionaryDataEpic]);
