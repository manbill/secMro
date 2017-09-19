import { Component } from '@angular/core';

/**
 * Generated class for the MachinesComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'machines',
  templateUrl: 'machines.html'
})
export class MachinesComponent {

  text: string;

  constructor() {
    console.log('Hello MachinesComponent Component');
    this.text = 'Hello World';
  }

}
