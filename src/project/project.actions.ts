import { Action } from 'redux';
import { Project } from './project.modal';
export const FETCH_PROJECTS_SUCCESS='fetch_projects_success';
export const SELECT_PROJECT='select_project';
export interface FetchProjectsAction extends Action{
  projects:Project[]
}
export interface SelectProjectAction extends Action{
  selectedProject:Project;
}
export function fetchProjectsSuccess(projects:Project[]):FetchProjectsAction{
  return {
    type:FETCH_PROJECTS_SUCCESS,
    projects:projects
  }
}
export function selectProject(project:Project):SelectProjectAction{
  return {
    type:SELECT_PROJECT,
    selectedProject:project
  }
}
