import { Action } from 'redux';
import { Material } from './material.modal';
export interface MaterialEntities{
  [id:number]:Material;
}
export interface MaterialState {
  ids:number[]
  materialEntities:MaterialEntities;
  isCompleted: boolean;
}
export const MaterialReducer = (state: MaterialState, action: Action): MaterialState => {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
