import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FanEquipmentsPage } from './fan-equipments';
import { TreeModule } from "tree-component/angular";
@NgModule({
  declarations: [
    FanEquipmentsPage,
  ],
  imports: [
    IonicPageModule.forChild(FanEquipmentsPage),
    TreeModule
  ],
})
export class FanEquipmentsPageModule {}
