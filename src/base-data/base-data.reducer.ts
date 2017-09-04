import { fetDictionaryDataEpic } from './dictionary/dictionary.epics';
import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';

import { DictionaryState, DictionaryReducer, DictionaryEpics } from './dictionary/dictionary.reducer';
import { FormGroup } from '@angular/forms';
import { MaterialState } from './material/material.reducer';
export interface BaseDataState{
  dictionaryState:DictionaryState,
  materialState:MaterialState
}
export const BaseDataReducer=combineReducers({
  dictionaryState:DictionaryReducer
})
export const RootBaseDataEpics=combineEpics(DictionaryEpics)
