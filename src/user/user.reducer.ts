import { RootCompanyEpics } from './../company/company.reducer';
import { User } from './user.modal';
import { combineReducers, Action } from 'redux';
import { ProjectReducer, ProjectState, RootProjectEpics } from '../project/project.reducer';
import { CompanyReducer, CompanyState } from '../company/company.reducer';
import * as UserActions from "./user.actions";
import { combineEpics } from "redux-observable";
import { loginEpic, setUserStateEpic } from './user.epics';
export interface UserState{
  projectState:ProjectState;
  companyState:CompanyState;
  currentUser:User;
  lastLoginTime:number;
}
export function UserReducer(state:User=null,action:Action):User{
  switch(action.type){
    default:{
      return state;
    }
    case UserActions.LOGIN_SUCCESS:{
      return (<UserActions.LoginSuccessAction>action).user
    }
    case UserActions.INIT_USER_STATE:{
      return (<UserActions.InitUserStateAction>action).userState.currentUser||state;;
    }
  }
}
export function LastLoginTimeReducer(state:number=Date.now(),action:Action):number{
  switch(action.type){
    default:{
      return state;
    }
    case UserActions.LOGIN_SUCCESS:{
      return Date.now();
    }
  }
}
export const UserRootReducer=combineReducers({
  projectState:ProjectReducer,
  companyState:CompanyReducer,
  currentUser:UserReducer,
  lastLoginTime:LastLoginTimeReducer
});
export const RootUserEpics=combineEpics(loginEpic,RootProjectEpics,RootCompanyEpics,setUserStateEpic);

