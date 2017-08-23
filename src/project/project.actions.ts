import { ActionCreator,Action } from 'redux';
import { Project } from './project.modal';
export const SET_CURRENT_PROJECT='project set current';
export interface SetCurrentProject extends Action{
  currentProject:Project
}
export const setCurrentProject:ActionCreator<SetCurrentProject>=(project:Project)=>{
  return {
    type:SET_CURRENT_PROJECT,
    currentProject:project
  }
}
