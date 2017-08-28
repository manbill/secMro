import { ActionsObservable } from 'redux-observable';
import { Store, Action } from 'redux';
import { FETCH_PROJECTS_SUCCESS } from '../project/project.actions';
import { AppState, EpicDependencies } from '../app/app.reducer';
import 'rxjs/add/operator/map';
import { fetchCompaniesFullfiled } from './company.actions';
export const fetchCompaniesEpic=(action$:ActionsObservable<Action>,store:Store<AppState>,deps:EpicDependencies)=>action$.ofType(FETCH_PROJECTS_SUCCESS)
.map(()=>{
  const companies=Object.keys(store.getState().userState.companyState.companyEntities).map((id)=>store.getState().userState.companyState.companyEntities[id]);
  fetchCompaniesFullfiled(companies);
});
