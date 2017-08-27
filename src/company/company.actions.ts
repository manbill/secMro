import { Company } from './company.modal';
import { CompanyState } from './company.reducer';
import { Action, ActionCreator } from 'redux';
import * as CompanyActions from "./company.actions";
export const FETCH_COMPANIES = 'fetch_companies';
export const SET_COMPANIES = 'set_companies';
export const SELECT_COMPANY = 'select_company';
export const SELECT_COMPANY_COMPLETE='select_company_complete';
export const INIT_COMPANY_STATE='init_company_state';
export interface SetCompaniesAction extends Action {
  companies: Company[]
}
export interface InitCompanyStateAction extends Action{
  companyState:CompanyState;
}
export const initCompanyState:ActionCreator<InitCompanyStateAction>=(companyState:CompanyState)=>({
  type:INIT_COMPANY_STATE,
  companyState:companyState
})
export interface SelectCompanyAction extends Action {
  selectedCompany: Company
}
export const setCompanies: ActionCreator<SetCompaniesAction> = (companies) => ({
  type: SET_COMPANIES,
  companies: companies
});
export const fetchCompanies: ActionCreator<Action> = () => ({
  type: FETCH_COMPANIES
})
export const selectCompany: ActionCreator<SelectCompanyAction> = (company: Company) => ({
  type: SELECT_COMPANY,
  selectedCompany: company
});
export const selectCompanyComplete:ActionCreator<Action>=()=>({
  type:SELECT_COMPANY_COMPLETE
})
