import { fetchCompaniesEpic } from './company.epics';
import { combineEpics } from 'redux-observable';
import { Company } from './company.modal';
import { Action } from 'redux';
import * as CompanyActions from "./company.actions";
import { INIT_USER_STATE,InitUserStateAction } from "../user/user.actions";
import { Project } from '../project/project.modal';
export interface CompanyEntities{
  [id:number]:Company;
}
export interface CompanyState{
  companyEntities:CompanyEntities;
  ids:number[];
  selectedCompany:Company;
}
const company=new Company();
company.companyId=1;
company.companyName="上海电气风电集团有限公司";
company.projectIds=[];
const initState:CompanyState={
  companyEntities:[company].reduce((entities,c)=>{entities[c.companyId]=c;return entities},{}),
  ids:[company].map(c=>c.companyId),
  selectedCompany:company,
}
export function CompanyReducer(state:CompanyState=initState,action:Action):CompanyState{
  switch(action.type){
    default:{
      return state;
    }
    case CompanyActions.SELECT_COMPANY:{
      return {
        ...state,
        selectedCompany:(<CompanyActions.SelectCompanyAction>action).company
      }
    }
    case INIT_USER_STATE:{
      return (<InitUserStateAction>action).userState.companyState;
    }
    case CompanyActions.FETCH_COMPANIES_FULLFILED:{
      const companies =(<CompanyActions.FetchCompaniesAction>action).companies;
      return {
        ...state,
        companyEntities:companies.reduce((entites,c)=>{entites[c.companyId]=c;return entites},{}),
        ids:companies.map((c)=>c.companyId)
      }
    }
  }
}
export const RootCompanyEpics=fetchCompaniesEpic;
