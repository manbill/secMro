import { Company } from './company.modal';
import { CompanyState } from './company.reducer';
import { Action, ActionCreator } from 'redux';
import * as CompanyActions from "./company.actions";
export const FETCH_COMPANIES = 'fetch_companies';
export const SET_COMPANIES = 'set_companies';
export const SELECT_COMPANY = 'select_company';
export interface SetCompaniesAction extends Action {
  companies: Company[]
}
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
})
