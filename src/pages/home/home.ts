import { UserState } from './../../user/user.reducer';
import { Store, Unsubscribe } from 'redux';
import { AppState } from '../../app/app.reducer';
import { AppStore } from '../../app/app.store';
import { Component, Inject, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { tableNames } from '../../providers/db-operation/mro.tables';
import { DbOperationProvider } from './../../providers/db-operation/db-operation';
import { MroUtils } from '../../common/mro-util';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  unsubscribe: Unsubscribe;
  projectName: string;
  companyName: string;
  constructor(private navCtrl: NavController,
    @Inject(AppStore) private store: Store<AppState>,
    private sqlite: DbOperationProvider,
    private navParams: NavParams) {
    this.unsubscribe = store.subscribe(() => {
      this.companyName = store.getState().userState.companyState.selectedCompany.companyName;
      this.projectName = store.getState().userState.projectState.selectedProject.projectName;
    });
  }
  ngOnInit() {
    this.store.dispatch({type:'home'});//这个action主要是为了获取用户所选择的公司和项目的名称
  }
  ionViewDidLoad() {
    //  console.log('home');
    // console.log("getViews",this.navCtrl.getViews());
    // console.log("getActive",this.navCtrl.getActive());
    // console.log("getPrevious",this.navCtrl.getPrevious());
    // console.log("last",this.navCtrl.last());
    // console.log("first",this.navCtrl.first());
  }
  ionViewDidLeave() {
    console.debug("ionViewDidLeave");
    this.unsubscribe&&this.unsubscribe();
  }
}
