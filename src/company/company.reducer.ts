import { inspect } from 'util';
import { MroError, generateMroError, MroErrorCode } from './../app/mro-error-handler';
import { tableNames } from './../providers/db-operation/mro.tables';
import { Observable } from 'rxjs/Observable';
import { SetchProjectsAction, fetchProjects } from './../project/project.actions';
import { Store } from 'redux';
import { AppState, EpicDependencies } from './../app/app.reducer';
import { ActionsObservable } from 'redux-observable';
import { combineEpics } from 'redux-observable';
import { Action, ActionCreator } from 'redux';
import { Company } from "./company.modal";
import * as CompanyActions from "./company.actions";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

export interface CompanyEntities {
  [id: number]: Company
}
export interface CompanyState {
  companyEntities: CompanyEntities,
  ids: number[];
  currentCompany: Company
}
const company = new Company();
company.companyId = 1;
company.companyName = `上海电气风电集团有限公司`;
company.projectIds = [];
const initialCompanyState = {
  companyEntities: [company].reduce((entities, c) => entities[c.companyId]=company, {}),
  ids: [company].map((c) => c.companyId),
  currentCompany: company
}
export const CompanyReducer = (state: CompanyState = initialCompanyState, action: Action): CompanyState => {
  switch (action.type) {
    default: {
      return state
    }
    case CompanyActions.SET_COMPANIES: {
      const companies = (<CompanyActions.SetCompaniesAction>action).companies;
      return {
        ...state,
        ids: companies.map((company) => company.companyId),
        companyEntities: companies.reduce((entities, company) => entities[company.companyId] = company, {})
      }
    }
    case CompanyActions.SELECT_COMPANY: {
      return {
        ...state,
        currentCompany: (<CompanyActions.SelectCompanyAction>action).selectedCompany
      }
    }
  }
}
export const selectCompanyEpic=(action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies)=>{
  return action$.ofType(CompanyActions.SELECT_COMPANY)
  .switchMap((action:CompanyActions.SelectCompanyAction)=>{
    const loading =deps.loadingCtrl.create({
      content:'选择项目更新到数据库...'
    });
    loading.present();
    return deps.dbOperation.executeSql(`update ${tableNames.eam_user} set selectedCompanyJson=? where userId=?`,[JSON.stringify(action.selectedCompany),store.getState().currentUser.currentUser.id])
    .do(()=>loading.dismiss())
	// ☐待确定的动作
    .mapTo({type:''})
    .catch((e)=>{
      loading.dismiss();
      let err: MroError = new MroError(MroErrorCode.user_info_db_update_error_code, `更新选中公司失败，${e.message}`, inspect(e));
      console.error(`${err.errorMessage},原因：`,e);
      return Observable.of(generateMroError(err))
    })
  })
}
export const fetchCompaniesEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(CompanyActions.FETCH_COMPANIES)
    .switchMap(() => {
      const company = new Company();
      company.companyId = 1;
      company.companyName = `上海电气风电集团有限公司`;
      company.projectIds = store.getState().projects.projects.map((project) => project.projectId);
      return Observable.of(CompanyActions.setCompanies([company]))
    })
}
export const setCompaniesEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(CompanyActions.SET_COMPANIES)
    .switchMap((action: CompanyActions.SetCompaniesAction) => {
      const loading =deps.loadingCtrl.create({
        content:'用户公司下的项目信息写入到数据库...'
      });
      loading.present();
      return deps.dbOperation.executeSql(`update ${tableNames.eam_user} set userCompaniesJson=? where userId=?`, [JSON.stringify(action.companies), store.getState().currentUser.currentUser.id])
      .do(()=>loading.dismiss())
	// ☐ 待确认
        .mapTo({ type: '' })
        .catch((e)=>{
          loading.dismiss();
          let err: MroError = new MroError(MroErrorCode.user_info_db_update_error_code, `更新用户表格中的公司失败，${e.message}`, inspect(e));
          console.error(`${err.errorMessage},原因：`,e);
          return Observable.of(generateMroError(err))
        })
    })

}
export const rootCompanyEpic = combineEpics(...[setCompaniesEpic,selectCompanyEpic,fetchCompaniesEpic]);
