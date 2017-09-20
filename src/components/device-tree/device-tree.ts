import { FanMachineEquipmentDetails, DeviceTree } from './../../business-data/fan-equipments/fan.modal';
import { DbOperationProvider } from './../../providers/db-operation/db-operation';
import { AppStore } from './../../app/app.store';
import { AppState } from './../../app/app.reducer';
import { Store, Unsubscribe } from 'redux';
import { Component, Inject } from '@angular/core';
import { TreeData } from "tree-component/angular";
import { EventData, DropPosition, clearMarkerOfTree } from 'tree-component/common';
import { getSelectedFanDetail } from '../../business-data/fan-equipments/fan.reducer';

/**
 *  = [{
    text: 'root',
    value: 'root',
    state: {
      openable: true,
      opened: false,
      selected: false,
      disabled: false,
      loading: false,
      highlighted: false,
      dropPosition: 0,
      dropAllowed: true
    },
    children: [
      {
        text: 'root_node1',
        value: 'node1',
        state: {
          opened: false,
          selected: false,
          disabled: false,
          loading: false,
          highlighted: false,
          openable: false,
          dropPosition: 0,
          dropAllowed: true
        },
        children: []
      }
    ]
  }];
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
  deviceTreeUnsubscribe: Unsubscribe;
  deviceTreeData: TreeData[] = [];
  constructor( @Inject(AppStore) private store: Store<AppState>) {
    console.log('DeviceTreeComponent')
  }
  toggle(data: EventData) {
    console.log(data);
    data.data.state.opened = !data.data.state.opened;
  }
  ngOnDestroy() {
    this.deviceTreeUnsubscribe && this.deviceTreeUnsubscribe();
  }
  ngOnInit() {
    this.deviceTreeUnsubscribe = this.store.subscribe(() => {
      const fanDetail = getSelectedFanDetail(this.store.getState());
      const deviceTree = fanDetail ? fanDetail.deviceTree : null;
      this.deviceTreeData = [];
      if (deviceTree) {
        const rootNode: TreeData = {
          text: deviceTree.equipmentName,
          state: {
            opened: false,
            selected: false,
            disabled: false,
            loading: false,
            highlighted: true,
            openable: deviceTree.childDeviceTrees.length > 0,
            dropPosition: 0,
            dropAllowed: false,
          },
          children: this.getTreeData(deviceTree.childDeviceTrees),
          icon: 'ios-snow-outline'
        }
        this.deviceTreeData.push(rootNode);
        console.log('TreeData', this.deviceTreeData);
      }
    })
  }
  getTreeData(deviceTrees: DeviceTree[]): Array<TreeData> {
    let treeDatas: TreeData[] = null;
    if (deviceTrees.length > 0) {
      treeDatas = [];
      deviceTrees.forEach((deviceTree) => {
        const node: TreeData = {
          text: deviceTree.equipmentName,
          value: deviceTree.equipmentId,
          state: {
            opened: false,
            selected: false,
            disabled: false,
            loading: false,
            highlighted: false,
            openable: deviceTrees.length > 0,
            dropPosition: 0,
            dropAllowed: false,
          },
          children: this.getTreeData(deviceTree.childDeviceTrees),
          icon: 'home'
        }
        treeDatas.push(node);
      })
    }
    return treeDatas;
  }
  onDeviceNodeChange(data: EventData) {
    console.log(data, data.data.value, data!.data);
    data.data.state.highlighted = true;
    clearMarkerOfTree(data.data);
  }
}
