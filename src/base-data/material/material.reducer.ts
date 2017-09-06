import { Action } from 'redux';
import { Material } from './material.modal';
import * as MaterialActions from "./material.actions";
export interface MaterialEntities{
  [id:number]:Material;
}
export interface MaterialState {
  ids:number[]
  materialEntities:MaterialEntities;
  isCompleted: boolean;
}
const initialState:MaterialState={
  ids:[],
  materialEntities:{},
  isCompleted:false
}
export const MaterialReducer = (state: MaterialState=initialState, action: Action): MaterialState => {
  switch (action.type) {
    default: {
      return state;
    }
    case MaterialActions.FETCH_MATERIAL_DATA_COMPLETED:{
      const materials =(<MaterialActions.FetchMaterialDataCompletedAction>action).materials;
      return {
        ...state,
        ids:materials.map(m=>m.materialId),
        materialEntities:materials.reduce((entities,m)=>{entities[m.materialId]=m;return entities},{}),
        isCompleted:true
      }
    }
  }
}
