import { MaterialState } from './material.reducer';
import { Action } from 'redux';
import { Material } from './material.modal';
import { BaseSearchParams } from '../../common/mro.search-params.modal';
export const FETCH_MATERIAL_DATA = 'fetch_material_data';
export const FETCH_MATERIAL_DATA_COMPLETED = 'fetch_material_data_completed';
export const DO_REFRESH_MATERIALS = 'do_refresh_materials';
export const LOAD_MORE_MATERIALS = 'load_more_materials';
export const LOAD_MORE_MATERIALS_COMPLETE = 'load_more_materials_complete';
export const INIT_MATERIAL_STATE = 'init_material_state';
export interface InitMaterialStateAction extends Action {
  state: MaterialState
}
export function initMaterialSate(state: MaterialState): InitMaterialStateAction {
  return {
    type: INIT_MATERIAL_STATE,
    state: state
  }

}
export function fetchMaterialData(): Action {
  return {
    type: FETCH_MATERIAL_DATA
  }
}
export function fetchMaterialDataCompleted(): Action {
  return {
    type: FETCH_MATERIAL_DATA_COMPLETED
  }
}
export function loadMoreMaterials(searParams?: MaterialSearchParams): LoadMoreMaterialsAction {
  return {
    type: LOAD_MORE_MATERIALS,
    searParams: searParams
  }
}
export function loadMoreMaterialsComplete(materials: Material[]): LoadMoreMaterialsCompleteAction {
  return {
    type: LOAD_MORE_MATERIALS_COMPLETE,
    materials: materials
  }
}
export function doRefreshMaterials(): Action {
  return {
    type: DO_REFRESH_MATERIALS
  }
}
export interface LoadMoreMaterialsAction extends Action {
  searParams: MaterialSearchParams
}
export interface LoadMoreMaterialsCompleteAction extends Action {
  materials: Material[];
}
export interface MaterialSearchParams extends BaseSearchParams {
  params?: Material
}
