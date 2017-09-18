import { AppStore } from './../../app/app.store';
import { AppState } from './../../app/app.reducer';
import { Unsubscribe, Store } from 'redux';
import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import {createFaultOrder} from '../../business-data/work-orders/fault-order/fault-order.actions'
import { WorkOrder } from '../../business-data/work-orders/work-order.modal';
import { getUserSelectedProjectId,getUserSelectedProject } from '../../user/user.reducer';
/**
 * Generated class for the CreateFaultOrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-fault-order',
  templateUrl: 'create-fault-order.html',
})
export class CreateFaultOrderPage {
  faultOrderForm: FormGroup;
  createOrderUnsubscribe: Unsubscribe;
  constructor(public navCtrl: NavController, private fb: FormBuilder, @Inject(AppStore) private store: Store<AppState>, public navParams: NavParams) {
    this.createOrderUnsubscribe=store.subscribe(()=>{
      if(store.getState().businessDataState.workOrderState.faultOrderState.createFaultOrderCompleted){
        navCtrl.pop();
        this.createOrderUnsubscribe();
      }
    })
  }
  createFaultOrderForm() {
    this.faultOrderForm = this.fb.group({
      positionId: [null, Validators.required],
      positionCode: [null, Validators.required],
      deviceId: [null, Validators.required],
      deviceName: [null, Validators.required],
      faultCode: [null, Validators.required],
      faultName: [null, Validators.required],
      faultBegindate: [null, Validators.required],
      faultEnddate: [null],
      shutdownTotalHour: [0],
      faultReason: [null, Validators.required],
      faultReasonName: [null, Validators.required],
      ncrTrigger: [1],//默认触发，是1,否则是0
      ncrNum: [''],
      workorderTitle: [null, Validators.required],
      faultDetailComment: [null, Validators.required],
      faultHandleDesc: [null, Validators.required],
      workorderId:[null],
      workorderCode:[null],
      projectId:[getUserSelectedProjectId(this.store.getState())],
      projectName:[getUserSelectedProject(this.store.getState()).projectName],
      workorderStatus:[41],
      workorderStatusName:['处理中'],
      createBy:[this.store.getState().userState.currentUser.id],
      createOn:[null],
      lastUpdBy:[this.store.getState().userState.currentUser.id],
      lastUpdOn:[null],
      workorderType:['38'],
      workorderTypeName:['人工填报故障']
    });
  }
  createFaultOrder() {
    const nowTime=Date.now();
    this.faultOrderForm.patchValue({
      lastUpdOn:nowTime,
      createOn:nowTime,
      workorderId:-nowTime.toString().substr(-8),
      workorderCode:`tempCodeGZ${-nowTime.toString().substr(-8)}`
    });
    const faultOrder:WorkOrder=Object.assign({},new WorkOrder(),this.faultOrderForm.value);
    this.store.dispatch(createFaultOrder(faultOrder));
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateFaultOrderPage');
  }

}
