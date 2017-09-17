import { MaintenanceComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MaintenanceOrdersPage } from './maintenance-orders';

@NgModule({
  declarations: [
    MaintenanceOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(MaintenanceOrdersPage),
    MaintenanceComponentsModule
  ],
  entryComponents: [

  ]
})
export class MaintenanceOrdersPageModule { }
