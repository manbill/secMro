import { Project } from './../project/project.modal';
import { User } from './../user/user.modal';
import { BaseDataSyncActions, BaseDataStateTypes } from './../base-data/base-data.actions';
import { HomePage } from './../pages/home/home';
import { TabsPage } from './../pages/tabs/tabs';
import { Observable } from 'rxjs/Observable';
import { inspect } from 'util';
import { Company } from './../company/company.modal';
import { UserState } from './../user/user.reducer';
import { MroUtils } from './../common/mro-util';
import { tableNames } from './../providers/db-operation/mro.tables';
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
import { LoginPage } from '../pages/login/login';
import { MroErrorCode, MroError } from "./mro-error-handler";
import { initUserState } from "../user/user.actions";

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
          return dbOp.executeSql(`select * from ${tableNames.eam_sync_actions}`)
            .map(res => MroUtils.changeDbRecord2Array(res))
        })
        .switchMap(res => {
          const sqls = [];
          if (res.length === 0) {
            BaseDataSyncActions.map((action) => sqls.push([`insert into ${tableNames.eam_sync_actions}(syncAction,lastSyncSuccessTime,syncStatus)values(?,?,?)`, [action, 0, 0]]));
            Object.keys(BaseDataStateTypes).map((baseType) => sqls.push([
              `insert into ${tableNames.eam_sync_base_data_state}(type,stateJson,initActionName)values(?,?,?)`, [
                BaseDataStateTypes[baseType]['type'],
                JSON.stringify(BaseDataStateTypes[baseType]['state']),
                BaseDataStateTypes[baseType]['initActionName']
              ]
            ]));
            return dbOp.sqlBatch(sqls);
          }
          return Observable.of(null);
        })
        .switchMap(() => {
          return dbOp.executeSql(`select * from ${tableNames.eam_sync_base_data_state}`)
            .map(res => MroUtils.changeDbRecord2Array(res))
            .do(res => console.log('eam_sync_base_data_state', res))
            .map((states) => {
              states.map((state) => {
                // console.log(state)
                this.store.dispatch({ type: state['initActionName'], state: JSON.parse(state['stateJson']) })
              });
            })
        })
        .switchMap(() => {
          //登录过，使用数据库中的数据初始化应用
          return dbOp.executeSql(`select * from ${tableNames.eam_user} where userId=?`, [MroUtils.getLastLoginUserId()])
            .map(res => MroUtils.changeDbRecord2Array(res))
            .map((res) => {
              let userState: UserState = {
                companyState: {
                  ids: [],
                  selectedCompany: {
                    companyId: 1,
                    companyName: '上海风电集团有限公司',
                    projectIds: []
                  },
                  companyEntities: {}
                },
                currentUser: new User(),
                isTokenValid: false,
                lastLoginTime: 0,
                projectState: {
                  ids: [],
                  projectEntities: {},
                  selectedProject: new Project()
                }
              };
              if (res.length > 0) {
                userState = JSON.parse(res[0]["userStateJson"]);
              }
              this.store.dispatch(initUserState(userState));
              return userState;
            })
        })
        .switchMap((userState: UserState) => {
          console.log(userState)
          let isLogin = false;
          if (new Date(userState.lastLoginTime).getDay() !== new Date().getDay()) {
            isLogin = true;
          }
          else {
            isLogin = true;
          }
          // ☐ 判断一下是否完成了基础数据下载、或需要重新登登
          return dbOp.executeSql(`select * from ${tableNames.eam_sync_actions} where syncStatus=?`, [0])
            .map(res => {
              const needDownloadActions = MroUtils.changeDbRecord2Array(res);
              if (needDownloadActions.length > 0) {//尚有未完成的基础数据需要下载
                isLogin = true;
              }
              return isLogin;
            });
        })
        .subscribe(
        (isLogin) => {
          if (isLogin) {
            this.nav.push(LoginPage);
            return;
          }
          this.nav.push(TabsPage);
          const unSubscription = this.store.subscribe(() => {
            if (!this.store.getState().userState.isTokenValid) {
              this.nav.push(LoginPage);
              // unSubscription();
            }
          });
        },
        e => console.error(e),
        () => console.log("初始化数据库版本完成", Date.now() - startTime, '毫秒')
        )
    }
    )
  }
}
