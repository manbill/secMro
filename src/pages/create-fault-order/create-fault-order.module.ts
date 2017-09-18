import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateFaultOrderPage } from './create-fault-order';

@NgModule({
  declarations: [
    CreateFaultOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateFaultOrderPage),
  ],
})
export class CreateFaultOrderPageModule {}
