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
import { fetchDictionaryData } from "../../base-data/dictionary/dictionary.actions";
import { fetchMaterialData } from '../../base-data/material/material.actions';
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
    this.store.dispatch(fetchDictionaryData());
    this.store.dispatch(fetchMaterialData())
  }
  unsubscribe: Unsubscribe;
  homeRoot = HomePage;
  aboutRoot = AboutPage;
  contactRoot = ContactPage;
  projectName:string;
  companyName:string;
  constructor(private sqlite: DbOperationProvider, private navCtrl: NavController, @Inject(AppStore) private store: Store<AppState>) {
    console.log("TabsPage,constructor");
    this.unsubscribe = store.subscribe(() => {
      // if(!store.getState().baseDataState.dictionaryState.isCompleted){
      //   navCtrl.push(LoginPage);
      //   this.unsubscribe();
      // }
    })
  }
}
