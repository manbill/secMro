import { DictionaryState } from './dictionary/dictionary.reducer';
import { MaterialState } from './material/material.reducer';
import { FETCH_DICTIONARY_DATA,INIT_DICTIONARY_STATE } from './dictionary/dictionary.actions';
import { FETCH_MATERIAL_DATA ,INIT_MATERIAL_STATE} from './material/material.actions';
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
export const BaseDataStateTypes:IBaseDataStateTypes={
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
export interface IBaseDataStateTypes {
  materialStatetype: MaterialStatetype;
  dictionaryStateType: DictionaryStateType;
}
