import { FanMachineEquipmentDetails } from './../../business-data/fan-equipments/fan.modal';
import { DbOperationProvider } from './../../providers/db-operation/db-operation';
import { AppStore } from './../../app/app.store';
import { AppState } from './../../app/app.reducer';
import { Store } from 'redux';
import { Component, Inject } from '@angular/core';
import { TreeData } from "tree-component/angular";
import { EventData } from 'tree-component/common';
import { getMachineDetailInfo } from '../../business-data/fan-equipments/fan.reducer';

/**
 * Generated class for the DeviceTreeComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'device-tree',
  templateUrl: 'device-tree.html'
})
export class DeviceTreeComponent {
  deviceTreeData: TreeData[];
  constructor( @Inject(AppStore) private store: Store<AppState>) { }
  ngOnInit() {
    const machineDetails = getMachineDetailInfo(this.store.getState());

  }
  getTreeData(machineDetails:FanMachineEquipmentDetails){

    if(machineDetails.deviceTree.childDeviceTrees.length>0){
    }
  }
  onDeviceNodeChange(data: EventData) {

  }
}
