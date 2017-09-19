import { DeviceTreePageModule } from './../device-tree/device-tree.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FanEquipmentsPage } from './fan-equipments';
@NgModule({
  declarations: [
    FanEquipmentsPage,
  ],
  imports: [
    IonicPageModule.forChild(FanEquipmentsPage),
    DeviceTreePageModule
  ],
})
export class FanEquipmentsPageModule {}
