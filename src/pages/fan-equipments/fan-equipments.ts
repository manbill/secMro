import { DeviceTreePage } from './../device-tree/device-tree';
import { MachineSearchParams } from './../../business-data/fan-equipments/fan.actions';
import { FanMachine } from './../../business-data/fan-equipments/fan.modal';
import { AppStore } from './../../app/app.store';
import { AppState } from './../../app/app.reducer';
import { Component, Inject, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, Refresher } from 'ionic-angular';
import { Store, Unsubscribe } from 'redux';
import { getMachines } from '../../business-data/fan-equipments/fan.reducer';
import * as FanMachineActions from "../../business-data/fan-equipments/fan.actions";


/**
 * Generated class for the FanEquipmentsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fan-equipments',
  templateUrl: 'fan-equipments.html',
})
export class FanEquipmentsPage {
  unsubscribe: Unsubscribe;
  loadMoreUnsubscribe: Unsubscribe;
  refreshUnsubscribe: Unsubscribe;
  machines: FanMachine[];
  searchParams: MachineSearchParams;
  constructor(public navCtrl: NavController, private _ngZone: NgZone, public navParams: NavParams, @Inject(AppStore) private store: Store<AppState>) {
    this.searchParams = {
      pageNumber: 1,
      machineId: null,
      ids: [],
      positionCode: null
    }
  }
  ngOnInit() {
    this.unsubscribe = this.store.subscribe(() => {
      this.machines = getMachines(this.store.getState());
      console.log(this.machines, NgZone.isInAngularZone());
    });
    this.store.dispatch(FanMachineActions.fetchFanMachineData());
    this.store.dispatch(FanMachineActions.manualRefreshMachineList());
    this.searchParams.pageNumber = 1;
    this.store.dispatch(FanMachineActions.loadMoreFanMachineData(this.searchParams));
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FanEquipmentsPage');

  }
  onSelectFanMachine(machine: FanMachine) {
    this.store.dispatch(FanMachineActions.selectMachine(machine))
    this.navCtrl.push(DeviceTreePage);
  }
  refreshMachineList(refresher: Refresher) {
    this.refreshUnsubscribe = this.store.subscribe(() => {
      if (this.store.getState().businessDataState.fanMachineState.refreshDataCompleted) {
        refresher.complete();
      }
    });
    this.store.dispatch(FanMachineActions.fetchFanMachineData());
    this.store.dispatch(FanMachineActions.manualRefreshMachineList());
    this.searchParams.machineId = null;
    this.searchParams.pageNumber = 1;
    this.searchParams.positionCode = null;
    this.store.dispatch(FanMachineActions.loadMoreFanMachineData(this.searchParams));
  }
  loadMoreMachines(infiniteScroll: InfiniteScroll) {
    this.loadMoreUnsubscribe = this.store.subscribe(() => {
      if (this.store.getState().businessDataState.fanMachineState.loadMoreDataCompleted) {
        infiniteScroll.complete();
      }
      infiniteScroll.enable(!!this.store.getState().businessDataState.fanMachineState.hasMoreData);
    });
    this.searchParams.pageNumber++;
    this.store.dispatch(FanMachineActions.loadMoreFanMachineData(this.searchParams));
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe();
    this.loadMoreUnsubscribe&&this.loadMoreUnsubscribe();
    this.refreshUnsubscribe&&this.refreshUnsubscribe();
  }
}
