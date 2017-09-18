import { CreateFaultOrderPage } from './../create-fault-order/create-fault-order';
import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher, InfiniteScroll } from 'ionic-angular';
import { WorkOrder } from '../../business-data/work-orders/work-order.modal';
import { AppState } from '../../app/app.reducer';
import { AppStore } from '../../app/app.store';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Store, Unsubscribe } from 'redux';
import { getFaultOrderItems } from '../../business-data/work-orders/fault-order/fault-order.reducer';
import { manualRefreshFaultOrderList, loadMoreFaultOrders, FaultOrderSearchParams, autoRefreshFaultOrderList, fetchFaultOrderData } from '../../business-data/work-orders/fault-order/fault-order.actions';

/**
 * Generated class for the FaultOrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fault-order',
  templateUrl: 'fault-order.html',
})
export class FaultOrderPage {
  faultOrders: WorkOrder[];
  faultOrdersUnsbuscribe: Unsubscribe;
  refreshUnsubscribe: Unsubscribe;
  loadMoreUnsubscribe: Unsubscribe;
  searchForm: FormGroup;
  searchParams: FaultOrderSearchParams = {
    pageNumber: 0,
    searchParams: {
      workorderCode: null,
      faultBegindate: null,
      faultCode: null,
      workorderId: null,
      workorderIds: [],
      workorderStatus: null,
      workorderType: null
    }
  }
  constructor(public navCtrl: NavController, private fb: FormBuilder, public navParams: NavParams, @Inject(AppStore) private store: Store<AppState>) {
    this.faultOrdersUnsbuscribe = store.subscribe(() => {
      this.faultOrders = getFaultOrderItems(store.getState());
    });
    this.createSearchForm();
  }
  createSearchForm() {
    this.searchForm = this.fb.group({
      pageNumber: [0, Validators.required],
      searchParams: this.fb.group({
        workorderCode: [null],
        faultBegindate: [null],
        faultCode: [],
        workorderId: [null],
        workorderIds: [[]],
        workorderStatus: [null],
        workorderType: [null]
      })
    })
  }
  ionViewDidLoad() {
    this.store.dispatch(fetchFaultOrderData());
    this.store.dispatch(manualRefreshFaultOrderList());
    this.searchParams.pageNumber++;
    this.searchForm.setValue(this.searchParams);
    console.log(this.searchForm.value);
    console.log('ionViewDidLoad FaultOrderPage', this.searchForm.value);
    this.store.dispatch(loadMoreFaultOrders(this.searchForm.value));
  }
  ionViewDidLeave() {
    this.faultOrdersUnsbuscribe();
    this.refreshUnsubscribe && this.refreshUnsubscribe();
    this.loadMoreUnsubscribe && this.loadMoreUnsubscribe();
  }
  doRefreshFaultOrders(refresher: Refresher) {
    this.searchParams.pageNumber = 1;
    this.searchForm.reset(this.searchParams);
    console.log('doRefreshFaultOrders', this.searchForm.value);
    this.refreshUnsubscribe = this.store.subscribe(() => {
      if (this.store.getState().businessDataState.workOrderState.faultOrderState.refreshCompleted) {
        refresher.complete();
      }
    })
    this.store.dispatch(fetchFaultOrderData());
    this.store.dispatch(manualRefreshFaultOrderList());
  }
  loadMoreFaultOrders(ionInfiniteScroll: InfiniteScroll) {
    this.searchParams.pageNumber++;
    this.searchForm.setValue(this.searchParams);
    console.log("loadMoreFaultOrders", this.searchForm.value);
    this.store.subscribe(() => {
      if (!this.store.getState().businessDataState.workOrderState.faultOrderState.hasMoreData) {
        ionInfiniteScroll.enable(false);
      }else{
        ionInfiniteScroll.enable(true);
      }
      if (this.store.getState().businessDataState.workOrderState.faultOrderState.loadMoreDataCompleted) {
        ionInfiniteScroll.complete();
      }
    });
    this.store.dispatch(loadMoreFaultOrders(this.searchForm.value));
  }
  createFaultOrder(){
    this.navCtrl.push(CreateFaultOrderPage);
  }
}
