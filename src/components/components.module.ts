import { NgModule } from '@angular/core';
import { AssignComponent } from './assign/assign';
import { TaskComponent } from './task/task';
import { MachinesComponent } from './machines/machines';
import { TreeModule } from "angular-tree-component";
import { DeviceTreeComponent } from './device-tree/device-tree';
@NgModule({
  declarations: [
    AssignComponent,
    TaskComponent,
    MachinesComponent,
    DeviceTreeComponent
  ],
  imports: [TreeModule],
  exports: [
    AssignComponent,
    TaskComponent,
    MachinesComponent,
    DeviceTreeComponent
  ]
})
export class MroComponentsModule {

}
