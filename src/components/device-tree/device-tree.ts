import { FanMachineEquipmentDetails, DeviceTree } from './../../business-data/fan-equipments/fan.modal';
import { DbOperationProvider } from './../../providers/db-operation/db-operation';
import { AppStore } from './../../app/app.store';
import { AppState } from './../../app/app.reducer';
import { Store, Unsubscribe } from 'redux';
import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { TreeNode, TREE_ACTIONS, ITreeOptions, ITreeState, TreeComponent, IActionHandler, IActionMapping } from "angular-tree-component";
import { getSelectedFanDetail, getSelectedEquipmentDetail } from '../../business-data/fan-equipments/fan.reducer';
import { selectDeviceEquipment } from '../../business-data/fan-equipments/fan.actions';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'device-tree',
  templateUrl: 'device-tree.html'
})
export class DeviceTreeComponent implements AfterViewInit {
  @ViewChild('tree') treeComponent: TreeComponent;
  deviceTreeUnsubscribe: Unsubscribe;
  deviceTreeData = [];
  options: ITreeOptions = {
    // useVirtualScroll:true,
    // nodeHeight:5,
    displayField: 'name',
    idField: 'id',
    // childrenField: 'childDeviceTrees',
    nodeClass: (node: TreeNode) => {
      // console.log(node.data.data.icon)
      // icon ion-logo-reddit
      return 'icon ' + node.data.data.icon;
    }
  }
  constructor( @Inject(AppStore) private store: Store<AppState>, private alterCtrl: AlertController) {
    console.log('DeviceTreeComponent')
  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log(this.treeComponent.treeModel.getFocusedNode);
    this.treeComponent.treeModel
      .subscribe('focus', (data) => {
        console.log(data);
      });
  }
  ngOnDestroy() {
    this.deviceTreeUnsubscribe && this.deviceTreeUnsubscribe();
  }
  ngOnInit() {
    this.deviceTreeUnsubscribe = this.store.subscribe(() => {
      const fanDetail = getSelectedFanDetail(this.store.getState());
      const deviceTree = fanDetail.deviceTree;
      // this.deviceTreeData = deviceTree ? deviceTree.childDeviceTrees : [];
      if (deviceTree) {
        const rootNode = [{
          name: deviceTree.equipmentName,
          id: deviceTree.equipmentId,
          isExpanded: false,
          hasChildren: deviceTree.childDeviceTrees && deviceTree.childDeviceTrees.length > 0,
          children: this.getTreeData(deviceTree.childDeviceTrees),
          data: { icon: 'ios-snow-outline' }
        }]
        this.deviceTreeData = rootNode;
        console.log('TreeData', this.deviceTreeData);
      }
    })
  }
  getTreeData(deviceTrees: DeviceTree[]): Array<any> {
    let treeDatas = [];
    if (deviceTrees.length > 0) {
      deviceTrees.forEach((deviceTree) => {
        const node = {
          data: {
            icon: 'add-circle'
          },
          name: deviceTree.equipmentName,
          id: deviceTree.equipmentId,
          isExpanded: false,
          hasChildren: deviceTree.childDeviceTrees && deviceTree.childDeviceTrees.length > 0,
          children: this.getTreeData(deviceTree.childDeviceTrees)
        }
        treeDatas.push(node);
      })
    }
    return treeDatas;
  }
  onFocusedNode(data: any) {
    const selectednode = data.node.data;
    console.log('name:', selectednode.name, 'id', selectednode.id);
  }
  onActivate(e) {
    console.log(e.node.data);
    const alter = this.alterCtrl.create({
      title: '选择设备？',
      buttons: [
        {
          text: '确定',
          handler: () => {
            this.store.dispatch(selectDeviceEquipment(getSelectedEquipmentDetail(this.store.getState(), e.node.data.id)));
          }
        },
        {
          text: '取消',
          handler: () => {

          },
          role: 'cancel'
        }
      ]

    });
    alter.present();

  }
}
