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
    console.log("getViews",this.navCtrl.getViews());
    console.log("getActive",this.navCtrl.getActive());
    console.log("getPrevious",this.navCtrl.getPrevious());
    console.log("last",this.navCtrl.last());
    console.log("first",this.navCtrl.first());
    return new Promise((resolve, reject) => {
      if (MroUtils.getLastLoginUserId()) {
        console.log("resolve");
        resolve();
      } else {
        // this.navCtrl.push(LoginPage);
        console.log("reject",this.navCtrl.getViews());
        reject();
      }
    });
  }
}
