import { FanEquipmentsPage } from './../fan-equipments/fan-equipments';
import { InventoriesPage } from './../inventories/inventories';
import { InitUserStateAction, initUserState } from './../../user/user.actions';
import { LoginPage } from './../login/login';
import { MroUtils } from './../../common/mro-util';
import { UserState } from './../../user/user.reducer';
import { NavController, NavParams, Tab } from 'ionic-angular';
import { AppStore } from './../../app/app.store';
import { Store, Unsubscribe, Action } from 'redux';
import { AppState } from './../../app/app.reducer';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

import { AboutPage } from '../about/about';
import { HomePage } from '../home/home';
import { fetchDictionaryData } from "../../base-data/dictionary/dictionary.actions";
import { fetchMaterialData } from '../../base-data/material/material.actions';
import { eamSyncActionEntities } from '../../app/app.actions';
import { DbOperationProvider } from '../../providers/db-operation/db-operation';
import { tableNames } from '../../providers/db-operation/mro.tables';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.unsubscribe && this.unsubscribe();
  }
  ngOnInit(): void {
    console.log("ngOnInit");
  }
  ionViewDidLoad() {
  }
  unsubscribe: Unsubscribe;
  homeRoot = HomePage;
  aboutRoot = AboutPage;
  contactRoot = InventoriesPage;
  fanEquipment = FanEquipmentsPage;
  projectName: string;
  companyName: string;
  firtIn: true;
  constructor(private navCtrl: NavController, private sqlite: DbOperationProvider, @Inject(AppStore) private store: Store<AppState>) {
    console.log("TabsPage,constructor");
    this.firtIn = true;
  }
  onTabsChanged(tab: Tab) {
    console.log("onTabsChanged", tab.index)
    if (tab.index === 0 && !this.firtIn) {
      tab.goToRoot({
        keyboardClose: true
      })
    }
  }
}
