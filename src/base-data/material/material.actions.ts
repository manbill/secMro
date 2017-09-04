import { Action } from 'redux';
import { Material } from './material.modal';
export const FETCH_MATERIAL_DATA='fetch_material_data';
export const FETCH_MATERIAL_DATA_COMPLETED='fetch_material_data_completed';
export function fetchMaterialData():Action{
  return {
    type:FETCH_MATERIAL_DATA
  }
}
export function fetchMaterialDataCompleted( materials:Material[]):FetchMaterialDataCompletedAction{
  return {
    type:FETCH_MATERIAL_DATA_COMPLETED,
    materials:materials
  }
}
export interface FetchMaterialDataCompletedAction extends Action{
  materials:Material[];
}
