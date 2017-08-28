import { HomePage } from './../pages/home/home';
import { TabsPage } from './../pages/tabs/tabs';
import { Observable } from 'rxjs/Observable';
import { inspect } from 'util';
import { Company } from './../company/company.modal';
import { UserState } from './../user/user.reducer';
import { MroUtils } from './../common/mro-util';
import { tableNames } from './../providers/db-operation/mro.tables';
import { initAppStore, setNavCtrl } from './app.actions';
import { AppState } from './app.reducer';
import { Store } from 'redux';
import { AppStore } from './app.store';
import { DbOperationProvider } from './../providers/db-operation/db-operation';
import { Component, Inject, ViewChild, ErrorHandler } from '@angular/core';
import { Platform, NavController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import 'rxjs/add/operator/timestamp';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { LoginPage } from "../pages/login/login";
import { MroErrorCode, MroError } from "./mro-error-handler";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  @ViewChild('nav') nav: NavController;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private loadingCtrl: LoadingController, private errorHandler: ErrorHandler, private dbOp: DbOperationProvider, @Inject(AppStore) private store: Store<AppState>) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      let startTime = Date.now();
      dbOp
        .initSqlVersions()
        .switchMap(() => {
          console.log("MroUtils.getLastLoginUserId()", MroUtils.getLastLoginUserId());
          if (!MroUtils.getLastLoginUserId()) {
            return Observable.of(null);
          }
          const loading = loadingCtrl.create({
            content: '初始化用户信息...',
            dismissOnPageChange: true
          });
          loading.present();
          return dbOp.executeSql(`select * from ${tableNames.eam_user} where UserId=?`, [+MroUtils.getLastLoginUserId()])
            .map((res) => {
              let userState: UserState = {
                currentUser: null,
                userProject: {
                  currentProject:null,
                  lastSelectedProject:null,
                  projects:[]
                },
                userCompany: {
                  companyEntities:{},
                  currentCompany:null,
                  ids:[],
                  lastSelectedCompany:null
                }
              };
              if (res.rows.length > 0) {//首次使用
                const record = res.rows.item(0);
                console.log(record);
                userState.currentUser = JSON.parse(record['userJson']);
                userState.userProject.currentProject = userState.userProject.lastSelectedProject = JSON.parse(record['selectedProjectJson']);
                userState.userProject.projects = JSON.parse(record['userProjectsJson']);
                userState.userCompany.currentCompany = userState.userCompany.lastSelectedCompany = JSON.parse(record['selectedCompanyJson']);
                const companies: Company[] = JSON.parse(record['userCompaniesJson']) || [];
                userState.userCompany.ids = companies.map(((company) => company.companyId));
                userState.userCompany.companyEntities = companies.reduce((entities, company) => {
                  entities[company.companyId] = company;
                  return entities;
                }, {});
              }
              console.log("缓存的用户状态：", userState);
              loading.dismiss();
              return userState;
            })
            .catch((e: Error) => {
              console.error(e);
              loading.dismiss();
              let err = new MroError(MroErrorCode.user_info_db_upsert_error_code, `初始化用户信息,${e.message}`, inspect(e))
              errorHandler.handleError(err);
              return null;
            })
        })
        .subscribe(
        userState => {
          console.log("开始初始化AppStore", userState)
          if (!userState) {
            this.nav.push(LoginPage);
            return;
          }
          this.nav.push(TabsPage,{userState:userState});
        },
        e => console.error(e),
        () => console.log("初始化数据库版本完成", Date.now() - startTime, '毫秒')
        )
    }
    )
  }
}
