import { AppStore } from './../../app/app.store';
import { AppState } from './../../app/app.reducer';
import { Store } from 'redux';
import { NavController } from 'ionic-angular';
import { Component, Inject } from '@angular/core';

/**
 * Generated class for the AssignComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'mro-assign',
  templateUrl: 'assign.html'
})
export class AssignComponent {

  text: string;
  assignItems:any[];
  constructor(private navCtrl: NavController, @Inject(AppStore) private store: Store<AppState>) {
    console.log('Hello AssignComponent Component');
    this.text = 'Hello World';
  }

}
