import { Project } from "./project.modal";
import { Action } from "redux";
import * as ProjectActions from "./project.actions";
export interface ProjectState {
  currentproject: Project
}
export const ProjectReducer = function (projectState: ProjectState, action: Action): ProjectState {
  switch (action.type) {
    case ProjectActions.SET_CURRENT_PROJECT: {
      const project=(<ProjectActions.SetCurrentProject>action).currentProject;
      return {
        ...projectState,
        currentproject:project
      }
    }
    default: {
      return projectState
    }
  }
}

