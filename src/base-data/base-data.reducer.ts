import { fetDictionaryDataEpic } from './dictionary/dictionary.epics';
import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import { DictionaryState, DictionaryReducer, DictionaryEpics } from './dictionary/dictionary.reducer';
import { FormGroup } from '@angular/forms';
import { MaterialState, MaterialReducer } from './material/material.reducer';
import { MaterialEpics } from './material/material.epics';
import { RootWarehouseEpics, WarehouseState, WarehouseReducer } from './warehouse/warehouse.reducer';
import { RootManualInstructorEpics, ManualInstructorState, ManualInstructorReducer } from './manual-instructor/instructor.reducer';
export interface BaseDataState {
  dictionaryState: DictionaryState,
  materialState: MaterialState,
  warehouseState: WarehouseState,
  manualInstructorState: ManualInstructorState
}
export const BaseDataReducer = combineReducers({
  dictionaryState: DictionaryReducer,
  materialState: MaterialReducer,
  warehouseState: WarehouseReducer,
  manualInstructorState: ManualInstructorReducer
})
export const RootBaseDataEpics = combineEpics(DictionaryEpics, MaterialEpics, RootWarehouseEpics, RootManualInstructorEpics)
export interface IBaseDataState{
  isCompleted:boolean,
  hasMoreData?:boolean,
  loadMoreDataCompleted?:boolean
}
