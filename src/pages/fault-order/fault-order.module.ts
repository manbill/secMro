import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaultOrderPage } from './fault-order';

@NgModule({
  declarations: [
    FaultOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(FaultOrderPage),
  ],
})
export class FaultOrderPageModule {}
