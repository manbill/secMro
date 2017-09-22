import { not } from 'ramda';
import { TokenState } from './user.reducer';
import { Project } from './../project/project.modal';
import { RootCompanyEpics } from './../company/company.reducer';
import { User } from './user.modal';
import { combineReducers, Action } from 'redux';
import { ProjectReducer, ProjectState, RootProjectEpics } from '../project/project.reducer';
import { CompanyReducer, CompanyState } from '../company/company.reducer';
import * as UserActions from "./user.actions";
import { combineEpics } from "redux-observable";
import { loginEpic, setUserStateEpic } from './user.epics';
import * as moment from "moment/moment";
import { AppState } from '../app/app.reducer';
export interface UserState {
  projectState: ProjectState;
  companyState: CompanyState;
  currentUser: User;
  lastLoginState: LastLoginState;
  tokenState: TokenState
}
export function UserReducer(state: User = null, action: Action): User {
  switch (action.type) {
    default: {
      return state;
    }
    case UserActions.LOGIN_ACTION: {
      const loginInfo = (<UserActions.LoginAction>action).userInfo
      return {
        ...state,
        token: null,
        name: loginInfo.userName,
        password: loginInfo.password,
        list: []
      }
    }
    case UserActions.LOGIN_SUCCESS: {
      return {
        ...state,
        ...((<UserActions.LoginSuccessAction>action).user)
      }
    }
    case UserActions.INIT_USER_STATE: {
      return {
        ...state,
        ...((<UserActions.InitUserStateAction>action).userState.currentUser)
      };
    }
  }
}
export interface LastLoginState {
  lastLoginTime: number;
}
export function LastLoginTimeReducer(state: LastLoginState = {
  lastLoginTime: 0
}, action: Action): LastLoginState {
  switch (action.type) {
    default: {
      return state;
    }
    case UserActions.LOGIN_SUCCESS: {
      return {
        ...state,
        lastLoginTime: Date.now()
      }
    }
    case UserActions.INIT_USER_STATE: {
      return (<UserActions.InitUserStateAction>action).userState.lastLoginState;
    }
  }
}
export interface TokenState {
  isTokenValid: boolean
}
export const TokenReducer = (state: TokenState = null, action: Action): TokenState => {
  switch (action.type) {
    default: {
      return state;
    }
    case UserActions.INIT_USER_STATE: {
      return (<UserActions.InitUserStateAction>action).userState.tokenState;
    }
    case UserActions.LOGIN_SUCCESS: {
      return {
        ...state,
        isTokenValid: true
      };
    }
    case UserActions.TOKEN_INVALID: {
      return {
        ...state,
        isTokenValid: false
      };
    }
  }
}
export const UserRootReducer = combineReducers({
  projectState: ProjectReducer,
  companyState: CompanyReducer,
  currentUser: UserReducer,
  lastLoginState: LastLoginTimeReducer,
  tokenState: TokenReducer
});
export const RootUserEpics = combineEpics(loginEpic, RootProjectEpics, RootCompanyEpics, setUserStateEpic);
export function getUserSelectedProjectId(state: AppState): number {
  return state.userState.projectState.selectedProject.projectId;
};
export function getUserSelectedProject(state: AppState): Project {
  return state.userState.projectState.selectedProject
}
export function getUserProjects(state:AppState):Project[]{
  return state.userState.projectState.ids.map(id=>state.userState.projectState.projectEntities[id]);
}
export function getCurrentUser(state:AppState):User{
  return state.userState.currentUser;
}
