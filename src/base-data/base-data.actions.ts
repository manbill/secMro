import { DictionaryState } from './dictionary/dictionary.reducer';
import { MaterialState } from './material/material.reducer';
import * as DictActions from './dictionary/dictionary.actions';
import * as MaterialActions from './material/material.actions';
import { Action } from 'redux';
import { WarehouseState } from './warehouse/warehouse.reducer';
import * as WarehouseActions from './warehouse/warehouse.actions';
import * as InstructorActions from './manual-instructor/instructor.actions';
import { ManualInstructorState } from './manual-instructor/instructor.reducer';
export const BASE_DATA_SYNC_COMPLETED = 'base_data_sync_completed';
export const BaseDataSyncActions = [
  DictActions.FETCH_DICTIONARY_DATA,
  MaterialActions.FETCH_MATERIAL_DATA,
  WarehouseActions.FETCH_WAREHOUSE_DATA,
  InstructorActions.FETCH_MANUAL_INSTRUCTOR_DATA
]
export function baseDataSyncComplete(): Action {
  return {
    type: BASE_DATA_SYNC_COMPLETED
  }
}
export const BaseDataStateTypes:IBaseDataStateTypes={
  manualStateType:{
    initActionName:InstructorActions.INIT_MANUAL_INSTRUCTORS,
    type:'base_manual_instructors_state',
    state:{
      ids:[],
      isCompleted:false,
      manualInstructorEntities:{}
    }
  },
  dictionaryStateType:{
    type:'base_dictionary_state',
    initActionName:DictActions.INIT_DICTIONARY_STATE,
    state:{
      detailIds:[],
      dictionaryEntities:{},
      isCompleted:false
    }
  },
  materialStatetype:{
    type:'base_materials_state',
    initActionName:MaterialActions. INIT_MATERIAL_STATE,
    state:{
      ids:[],
      isCompleted:false,
      materialEntities:{}
    }
  },
  warehouseStateType:{
    type:'base_warehouse_state',
    initActionName:WarehouseActions.INIT_WAREHOUSE_STATE,
    state:{
      isCompleted:false,
      ids:[],
      warehouseEntities:{}
    }
  }
}
interface MaterialStatetype extends BaseStateType {
  state: MaterialState
}
interface BaseStateType{
  type:string;
  initActionName:string;
}
interface DictionaryStateType extends BaseStateType{
  state: DictionaryState
}
interface WarehouseStateType extends BaseStateType{
  state: WarehouseState
}
interface ManualInstructorStateType extends BaseStateType{
  state: ManualInstructorState
}
export interface IBaseDataStateTypes {
  materialStatetype: MaterialStatetype;
  dictionaryStateType: DictionaryStateType;
  warehouseStateType:WarehouseStateType;
  manualStateType:ManualInstructorStateType;
}
