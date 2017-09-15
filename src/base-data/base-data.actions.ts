import { DictionaryState } from './dictionary/dictionary.reducer';
import { MaterialState } from './material/material.reducer';
import { FETCH_DICTIONARY_DATA,INIT_DICTIONARY_STATE } from './dictionary/dictionary.actions';
import { FETCH_MATERIAL_DATA ,INIT_MATERIAL_STATE} from './material/material.actions';
import { Action } from 'redux';
import { WarehouseState } from './warehouse/warehouse.reducer';
import { INIT_WAREHOUSE_STATE, FETCH_WAREHOUSE_DATA } from './warehouse/warehouse.actions';
import { FETCH_MANUAL_INSTRUCTOR_DATA, INIT_MANUAL_INSTRUCTORS } from './manual-instructor/instructor.actions';
import { ManualInstructorState } from './manual-instructor/instructor.reducer';
export const BASE_DATA_SYNC_COMPLETED = 'base_data_sync_completed';
export const BaseDataSyncActions = [
  FETCH_DICTIONARY_DATA,
  FETCH_MATERIAL_DATA,
  FETCH_WAREHOUSE_DATA,
  FETCH_MANUAL_INSTRUCTOR_DATA
]
export function baseDataSyncComplete(): Action {
  return {
    type: BASE_DATA_SYNC_COMPLETED
  }
}
export const BaseDataStateTypes:IBaseDataStateTypes={
  manualStateType:{
    initActionName:INIT_MANUAL_INSTRUCTORS,
    type:'base_manual_instructors_state',
    state:{
      ids:[],
      isCompleted:false,
      manualInstructorEntities:{}
    }
  },
  dictionaryStateType:{
    type:'base_materials_state',
    initActionName:INIT_DICTIONARY_STATE,
    state:{
      detailIds:[],
      dictionaryEntities:{},
      isCompleted:false
    }
  },
  materialStatetype:{
    type:'base_dictionary_state',
    initActionName:INIT_MATERIAL_STATE,
    state:{
      ids:[],
      isCompleted:false,
      materialEntities:{}
    }
  },
  warehouseStateType:{
    type:'base_warehouse_state',
    initActionName:INIT_WAREHOUSE_STATE,
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
