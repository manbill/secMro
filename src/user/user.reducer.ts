import { Project } from './../project/project.modal';
import { AppState } from './../app/app.reducer';
import { RootCompanyEpics } from './../company/company.reducer';
import { User } from './user.modal';
import { combineReducers, Action } from 'redux';
import { ProjectReducer, ProjectState, RootProjectEpics } from '../project/project.reducer';
import { CompanyReducer, CompanyState } from '../company/company.reducer';
import * as UserActions from "./user.actions";
import { combineEpics } from "redux-observable";
import { loginEpic, setUserStateEpic } from './user.epics';
import * as moment from "moment/moment";
export interface UserState {
  projectState: ProjectState;
  companyState: CompanyState;
  currentUser: User;
  lastLoginTime: number;
  isTokenValid: boolean
}
export function UserReducer(state: User = null, action: Action): User {
  switch (action.type) {
    default: {
      return state;
    }
    case UserActions.LOGIN_SUCCESS: {
      return (<UserActions.LoginSuccessAction>action).user
    }
    case UserActions.INIT_USER_STATE: {
      return (<UserActions.InitUserStateAction>action).userState.currentUser || state;
    }
  }
}
export function LastLoginTimeReducer(state: number = Date.now(), action: Action): number {
  switch (action.type) {
    default: {
      return state;
    }
    case UserActions.LOGIN_SUCCESS: {
      return moment.now();
    }
    case UserActions.INIT_USER_STATE: {
      return (<UserActions.InitUserStateAction>action).userState.lastLoginTime;
    }
  }
}
export const TokenReducer = (state: boolean = false, action: Action): boolean => {
  switch (action.type) {
    default: {
      return state;
    }
    case UserActions.INIT_USER_STATE: {
      return (<UserActions.InitUserStateAction>action).userState.isTokenValid;
    }
    case UserActions.LOGIN_SUCCESS: {
      return true;
    }
    case UserActions.TOKEN_INVALID: {
      return false;
    }
  }
}
export const UserRootReducer = combineReducers({
  projectState: ProjectReducer,
  companyState: CompanyReducer,
  currentUser: UserReducer,
  lastLoginTime: LastLoginTimeReducer,
  isTokenValid: TokenReducer
});
export const RootUserEpics = combineEpics(loginEpic, RootProjectEpics, RootCompanyEpics, setUserStateEpic);
export function getUserSelectedProjectId(state: AppState): number {
  return state.userState.projectState.selectedProject.projectId;
};
export function getUserSelectedProject(state: AppState): Project {
  return state.userState.projectState.selectedProject
}
