import { Project } from './project.modal';
import { Action } from 'redux';
import * as ProjectActions from "./project.actions";
import { combineEpics } from 'redux-observable';
import { fetchProjectsEpic } from './project.epics';
export interface ProjectEntities{
  [id:number]:Project;
}
export interface ProjectState{
  projectEntities:ProjectEntities;
  ids:number[];
  selectedProjectId:number;
}
export function ProjectReducer(state:ProjectState=null,action:Action):ProjectState{
  switch(action.type){
    default : {
      return state;
    }
    case ProjectActions.FETCH_PROJECTS_SUCCESS:{
      return {
        ...state
      }
    }
  }
}
export const RootProjectEpics=combineEpics(...[fetchProjectsEpic]);
