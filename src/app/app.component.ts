import { DbOperationProvider } from './../providers/db-operation/db-operation';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from "../pages/login/login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private dbOp: DbOperationProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.dbOp
        .initSqlVersions()
        .subscribe(
        res => console.log(res),
        e => console.error(e),
        () => console.log("初始化数据库版本完成")
        )
    }
    )
  }
}
