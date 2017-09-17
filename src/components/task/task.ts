import { AppStore } from './../../app/app.store';

import { AppState } from './../../app/app.reducer';
import { NavController, InfiniteScroll, Refresher } from 'ionic-angular';
import { Component, Inject,Input,EventEmitter } from '@angular/core';
import { WorkOrder } from "../../business-data/work-orders/work-order.modal";

/**
 * Generated class for the TaskComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'mro-task',
  templateUrl: 'task.html'
})
export class TaskComponent {

  text: string;
  @Input()
  taskItem: WorkOrder;
  onSelecteTask:EventEmitter<WorkOrder>;
  constructor() {
    this.onSelecteTask = new EventEmitter();
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
  onSelectTask(task){
    this.onSelecteTask.emit(task);
  }
}
