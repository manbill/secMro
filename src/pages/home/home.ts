import { eamSyncActionEntities } from './../../app/app.actions';
import { MaintenanceOrdersPage } from './../maintenance-orders/maintenance-orders';
import { UserState } from './../../user/user.reducer';
import { Store, Unsubscribe } from 'redux';
import { AppState, shouldLogin } from '../../app/app.reducer';
import { AppStore } from '../../app/app.store';
import { Component, Inject, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { tableNames } from '../../providers/db-operation/mro.tables';
import { DbOperationProvider } from './../../providers/db-operation/db-operation';
import { MroUtils } from '../../common/mro-util';
import { FaultOrderPage } from '../fault-order/fault-order';
import { LoginPage } from '../login/login';
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
    // this.store.dispatch({ type: 'home' });//这个action主要是为了获取用户所选择的公司和项目的名称
    // // this.faultOrders();
    // console.log('home,onInit');
  }
  ionViewDidEnter() {
    console.log('home,ionViewDidEnter');
    //执行未完成的同步函数
    this.sqlite.executeSql(`select * from ${tableNames.eam_sync_actions} where syncStatus=?`, [0])
      .map(res => MroUtils.changeDbRecord2Array(res))
      .do((actions) => console.log('尚未完成的actions: ', actions))
      .map((actions) => {
        actions.map((action) => {
          console.log('要执行的动作：', eamSyncActionEntities[action['syncAction']]);
          this.store.dispatch({ type: eamSyncActionEntities[action['syncAction']] });
        });
      })
      .subscribe(() => {
        console.log('home actions were dispatched');
      }, e => console.error(e), () => {
        console.log('home actions dispatched completed');
        // if (shouldLogin(this.store.getState())) {//如果尚有未完成的基础数据下载任务
        //   this.navCtrl.setRoot(LoginPage);
        // }
      });
  }
  ionViewDidLoad() {
    console.log('home,ionViewDidLoad');
  }
  maintenanceOrders() {
    this.navCtrl.push(MaintenanceOrdersPage);
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe && this.unsubscribe();
  }
  ionViewDidLeave() {
    console.debug("ionViewDidLeave");

  }
  faultOrders() {
    this.navCtrl.push(FaultOrderPage);
  }
}
