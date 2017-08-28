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
