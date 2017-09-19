import { MroComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeviceTreePage } from './device-tree';

@NgModule({
  declarations: [
    DeviceTreePage,
  ],
  imports: [
    IonicPageModule.forChild(DeviceTreePage),
    MroComponentsModule
  ],
})
export class DeviceTreePageModule {}
