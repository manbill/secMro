import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FanEquipmentsPage } from './fan-equipments';
@NgModule({
  declarations: [
    FanEquipmentsPage,
  ],
  imports: [
    IonicPageModule.forChild(FanEquipmentsPage),
  ],
})
export class FanEquipmentsPageModule {}
