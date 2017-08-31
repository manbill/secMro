import { InitUserStateAction,initUserState } from './../../user/user.actions';
import { LoginPage } from './../login/login';
import { MroUtils } from './../../common/mro-util';
import { tableNames } from './../../providers/db-operation/mro.tables';
import { DbOperationProvider } from './../../providers/db-operation/db-operation';
import { UserState } from './../../user/user.reducer';
import { NavController, NavParams } from 'ionic-angular';
import { AppStore } from './../../app/app.store';
import { Store, Unsubscribe } from 'redux';
import { AppState } from './../../app/app.reducer';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { moment } from "moment";
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.unsubscribe();
  }
  ngOnInit(): void {
    console.log("ngOnInit")
    // throw new Error("Method not implemented.");
  }
  unsubscribe: Unsubscribe;
  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  constructor(private sqlite: DbOperationProvider, private navCtrl: NavController, @Inject(AppStore) private store: Store<AppState>) {
    console.log("TabsPage,constructor");
    this.unsubscribe = store.subscribe(() => {

    })
  }
  ionViewCanEnter() {

    // console.log("getActive", this.navCtrl.getActive());
    // console.log("getPrevious", this.navCtrl.getPrevious());
    // console.log("last", this.navCtrl.last());
    // console.log("first", this.navCtrl.first());
    return new Promise((resolve, reject) => {

      // ☐ 需要加入基础数据是否加载完成的判断

      //如果登录过首先从数据库中获取上一次的userState，然后初始化应用的userState，再判断是否需要从新登录
      //否则直接跳转到登录界面，即，直接reject即可。
      if (MroUtils.getLastLoginUserId()) {//用户登录过，尝试从数据库恢复上一次的userSate
        this.sqlite.executeSql(`select * from ${tableNames.eam_user} where userId=?`, [MroUtils.getLastLoginUserId()])
          .map(res => {
            console.log(res);
            let userState: UserState = null;
            if (res.rows.length > 0) {
              userState = JSON.parse(res.rows.item(0)['userStateJson']);
            }
            console.log(userState);
            return userState;
          })
          .subscribe((userState: UserState) => {
            if (userState) {
              if (moment(userState.lastLoginTime).daysInMonth()!==moment().daysInMonth()) {//如果每天的首次使用，需要重新登录，即如果不是同一天了，需要重新登录
                console.log("每天首次使用，需要重新登录");
                reject();
                return;
              }
              //开始初始化userState
              console.log('开始恢复应用的上一次登录状态');
              this.store.dispatch(initUserState(userState));//初始化应用的状态
              console.log("getViews", this.navCtrl.getViews());
              resolve();
              this.navCtrl.remove(0,1);//删除loginPage
              console.log("getViews", this.navCtrl.getViews());
            } else {
              reject();
            }

          });
      } else {//首次登录使用应用
        console.log('首次使用应用，跳转到登录界面');
        // this.navCtrl.push(LoginPage);
        console.log("reject", this.navCtrl.getViews());
        reject();
      }
    });
  }
}
