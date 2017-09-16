import { Action } from 'redux';
export interface MaintenanceOrderState{

}
export function MaintenanceOrderReducer(state:MaintenanceOrderState,action:Action):MaintenanceOrderState{
  switch(action.type){
    default:{
      return {
        ...state
      }
    }
  }
}
