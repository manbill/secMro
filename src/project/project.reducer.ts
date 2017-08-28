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
  selectedProject:Project;
}
const initProjectState:ProjectState={
  projectEntities:{},
  ids:[],
  selectedProject:null
}
export function ProjectReducer(state:ProjectState=initProjectState,action:Action):ProjectState{
  switch(action.type){
    default : {
      return state;
    }
    case ProjectActions.SELECT_PROJECT:{
      return {
        ...state,
        selectedProject:(<ProjectActions.SelectProjectAction>action).selectedProject
      }
    }
    case ProjectActions.FETCH_PROJECTS_SUCCESS:{
      const projects =(<ProjectActions.FetchProjectsAction>action).projects;
      return {
        ...state,
        projectEntities:projects.reduce((entities,project)=>{entities[project.projectId]=project;return entities},{}),
        ids:projects.map(p=>p.projectId)
      }
    }
  }
}
export const RootProjectEpics=fetchProjectsEpic;
