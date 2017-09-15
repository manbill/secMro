import { Action } from 'redux';
import { Material } from './material.modal';
import * as MaterialActions from "./material.actions";
import { IBaseDataState } from '../base-data.reducer';
export interface MaterialEntities {
  [id: number]: Material;
}
export interface MaterialState extends IBaseDataState{
  ids: number[]
  materialEntities: MaterialEntities;
}
const initialState: MaterialState = {
  ids: [],
  materialEntities: {},
  isCompleted: false
}
export const MaterialReducer = (state: MaterialState = initialState, action: Action): MaterialState => {
  switch (action.type) {
    default: {
      return state;
    }
    case MaterialActions.INIT_MATERIAL_STATE: {
      return (<MaterialActions.InitMaterialStateAction>action).state
    }
    case MaterialActions.DO_REFRESH_MATERIALS: {//下拉刷新数据
      return {
        ...state,
        ids: [],
        materialEntities: {}
      }
    }
    case MaterialActions.FETCH_MATERIAL_DATA_COMPLETED: {//完成物料数据下载
      return {
        ...state,
        isCompleted: true
      }
    }
    case MaterialActions.LOAD_MORE_MATERIALS_COMPLETE: {//上拉加载更多数据
      const materials = (<MaterialActions.LoadMoreMaterialsCompleteAction>action).materials;
      return {
        ...state,
        ids: state.ids.concat(materials.map(m => m.materialId)),
        materialEntities: Object.assign({}, state.materialEntities, materials.reduce((entities, m) => { entities[m.materialId] = m; return entities }, {}))
      }
    }
  }
}
