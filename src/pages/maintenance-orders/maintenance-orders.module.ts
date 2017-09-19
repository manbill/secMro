import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MaintenanceOrdersPage } from './maintenance-orders';

@NgModule({
  declarations: [
    MaintenanceOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(MaintenanceOrdersPage),
  ],
  entryComponents: [

  ]
})
export class MaintenanceOrdersPageModule { }
