import { tableNames } from './../providers/db-operation/mro.tables';
import { combineEpics } from 'redux-observable';
import { inspect } from 'util';
import { MroError, MroErrorCode, generateMroError } from './../app/mro-error-handler';
import { MroUtils } from './../common/mro-util';
import { Observable } from 'rxjs/Observable';
import { Store } from 'redux';
import { AppState, EpicDependencies } from './../app/app.reducer';
import { ActionsObservable, Epic } from 'redux-observable';
import { Reducer, Action } from 'redux';
import { Project } from './project.modal';
import { ProjectState } from './project.reducer';
import * as ProjectActions from "./project.actions";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import * as Apis from "../providers/api/api";
import { Response, Headers } from "@angular/http";
import * as CompanyActions from "../company/company.actions";
export interface ProjectState {
  projects: Project[]
}
export const ProjectReducer: Reducer<ProjectState> = (state: ProjectState = null, action: Action): ProjectState => {
  switch (action.type) {
    case ProjectActions.SET_PROJECTS: {
      const projects = (<ProjectActions.SetchProjectsAction>action).projects;
      return {
        ...state,
        projects: projects
      }
    }
    default: {
      console.log("ProjectReducer,actionType: ", action.type);
      return state
    }
  }
}
export const fetchProjectsEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(ProjectActions.FETCH_PROJECTS)
    .do((action) => console.log("fetchProjectsEpic,actionType: ", action.type))
    .switchMap(() => {
      let reqArgs = MroUtils.generatePostReqArgs(store.getState().currentUser.currentUser.token);
      inspect(reqArgs);
      const loading = deps.loadingCtrl.create({
        content: '正在获取用户项目...'
      });
      loading.present();
      return deps.http.post(Apis.Api_getUserProject, {}, reqArgs)
        .do((res) => {loading.dismiss();console.log(res.json().data)})
        .map((res: Response) => ProjectActions.setProjects(res.json().data))
        .catch((e: Error) => {
          loading.dismiss();
          let err: MroError = new MroError(MroErrorCode.fetch_projects_error_code, `获取项目信息失败${e.message}`, inspect(e));
          console.error("项目获取失败:", e);
          return Observable.of(generateMroError(err))
        })
    })
}
export const setProjectsEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(ProjectActions.SET_PROJECTS)
  .switchMap((action)=>{
    const projects = (<ProjectActions.SetchProjectsAction>action).projects;
    const loading = deps.loadingCtrl.create({
      content:'项目信息正在写入数据库...'
    });
    loading.present();
    return deps.dbOperation.executeSql(`update ${tableNames.eam_user} set userProjectsJson=? where userId=?`,[JSON.stringify(projects),store.getState().currentUser.currentUser.id])
    .do(()=>loading.dismiss())
    .mapTo(CompanyActions.fetchCompanies())
    .catch((e: Error) => {
      console.error(e);
      loading.dismiss();
      let err: MroError = new MroError(MroErrorCode.fetch_projects_error_code, `项目信息写入数据库失败${e.message}`, inspect(e));
      console.error("项目信息写入数据库失败", e);
      return Observable.of(generateMroError(err))
    })
  })

}
export const rootProjectEpic = combineEpics(...[fetchProjectsEpic,setProjectsEpic])
