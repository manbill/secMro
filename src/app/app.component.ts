import { AppState } from './app.reducer';
import { Store } from 'redux';
import { AppStore } from './app.store';
import { DbOperationProvider } from './../providers/db-operation/db-operation';
import { Component,Inject } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import 'rxjs/add/operator/timestamp';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from "../pages/login/login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private dbOp: DbOperationProvider,@Inject(AppStore)private store:Store<AppState>) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      let startTime = Date.now();
      this.dbOp
        .initSqlVersions()
        .subscribe(
        res => console.log(res),
        e => console.error(e),
        () => console.log("初始化数据库版本完成",Date.now()-startTime,'毫秒')
        )
    }
    )
  }
}
