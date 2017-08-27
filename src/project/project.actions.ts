import { ActionCreator } from 'redux';
import { ProjectState } from './project.reducer';
import { Project } from './project.modal';
import { Action } from 'redux';
export const FETCH_PROJECTS='fetch_projects';
export const SET_PROJECTS='set_projects';
export const SELECT_PROJECT='select_project';
export const SELECT_PROJECT_COMPLETE='select_project_complete';
export const INIT_PROJECT_STATE='init_project_state';
export interface SetProjectsAction extends Action{
  projects:Project[];
}
export interface InitProjectStateAction extends Action{
  projectState:ProjectState
}
export const initProjectState :ActionCreator<InitProjectStateAction>=(projectState:ProjectState)=>({
  type:INIT_PROJECT_STATE,
  projectState:projectState
})
export const fetchProjects:ActionCreator<Action>=()=>({
  type:FETCH_PROJECTS
});
export const setProjects:ActionCreator<SetProjectsAction>=(projects:Project[])=>({
  type:SET_PROJECTS,
  projects:projects
})
export const selectProjectComplete:ActionCreator<Action>=()=>({
  type:SELECT_PROJECT_COMPLETE
})
export interface SelectProjectAction extends Action{
  selectedProject:Project;
}
export const selectProject:ActionCreator<SelectProjectAction>=(pro:Project)=>({
  type:SELECT_PROJECT,
  selectedProject:pro
})
