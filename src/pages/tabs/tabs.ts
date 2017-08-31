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
    throw new Error("Method not implemented.");
  }
  unsubscribe: Unsubscribe;
  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  constructor(private sqlite: DbOperationProvider, private navCtrl:NavController,@Inject(AppStore) private store: Store<AppState>) {
    this.unsubscribe = store.subscribe(() => {

    })
  }
  ionViewCanEnter() {
    return !!!MroUtils.getLastLoginUserId();
    // return new Promise((resovle,reject)=>{
    //   if(MroUtils.getLastLoginUserId()){
    //     setTimeout(()=> {
    //       resovle();
    //       console.log("TabsPage,ionViewCanEnter,resovle");
    //       return true;
    //     }, 2000);
    //   }else{
    //     reject();
    //     console.log("TabsPage,ionViewCanEnter,reject");
    //     return false;
    //   }
    // });
  }
}
