import { AppStore } from './../../app/app.store';
import { AppState } from './../../app/app.reducer';
import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher } from 'ionic-angular';
import { Store, Unsubscribe } from 'redux';
import { WorkOrder } from '../../business-data/work-orders/work-order.modal';

/**
 * Generated class for the MaintenanceOrdersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-maintenance-orders',
  templateUrl: 'maintenance-orders.html',
})
export class MaintenanceOrdersPage {
  maintenanceType: string;
  taskUnsubscribe: Unsubscribe;
  taskItems: WorkOrder[];
  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(AppStore) private store: Store<AppState>) {
    this.taskUnsubscribe = store.subscribe(() => {
    });
  }
  doRefresh(refresher:Refresher){
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MaintenanceOrdersPage');
  }
  ionViewDidLeave() {
    console.log('ionViewDidLeave MaintenanceOrdersPage');
    this.taskUnsubscribe();
  }
  onSelectTask(task){

  }
}
