import { Action } from 'redux';
import { Company } from './company.modal';
export const FETCH_COMPANIES_FULLFILED = 'fetch_companies_fullfiled';
export const SELECT_COMPANY = "select_company";
export const CHANGE_COMPANY = 'change_company';
export interface FetchCompaniesAction extends Action {
  companies: Company[]
}
export interface SelectCompanyAction extends Action {
  company: Company
}
export function selectCompany(company: Company): SelectCompanyAction {
  return {
    type: SELECT_COMPANY,
    company: company
  }
}
export function fetchCompaniesFullfiled(companies: Company[]): FetchCompaniesAction {
  return {
    type: FETCH_COMPANIES_FULLFILED,
    companies: companies
  }
}
