import { ActionCreator } from 'redux';
import { ProjectState } from './project.reducer';
import { Project } from './project.modal';
import { Action } from 'redux';
export const FETCH_PROJECTS='fetch_projects';
export const SET_PROJECTS='set_projects';
export interface SetchProjectsAction extends Action{
  projects:Project[];
}

export const fetchProjects:ActionCreator<Action>=()=>({
  type:FETCH_PROJECTS
});
export const setProjects:ActionCreator<SetchProjectsAction>=(projects:Project[])=>({
  type:SET_PROJECTS,
  projects:projects
})
