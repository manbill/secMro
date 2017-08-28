import { Action } from 'redux';
import { Project } from './project.modal';
export const FETCH_PROJECTS_SUCCESS='fetch_projects_success';
export interface FetchProjectsAction extends Action{
  projects:Project[]
}
export function fetchProjectsSuccess(projects:Project[]):FetchProjectsAction{
  return {
    type:FETCH_PROJECTS_SUCCESS,
    projects:projects
  }
}
