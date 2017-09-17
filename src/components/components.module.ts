import { NgModule } from '@angular/core';
import { AssignComponent } from './assign/assign';
import { TaskComponent } from './task/task';
@NgModule({
	declarations: [AssignComponent,
    TaskComponent],
	imports: [],
	exports: [AssignComponent,
    TaskComponent]
})
export class MaintenanceComponentsModule {

}
