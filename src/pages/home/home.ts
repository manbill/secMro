import { UserState } from './../../user/user.reducer';
import { Store } from 'redux';
import { AppState } from '../../app/app.reducer';
import { AppStore } from "../../app/app.store";
import { Component,Inject,OnInit } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(private navCtrl: NavController,
    private navParams: NavParams) {
  }
 ionViewDidLoad(){
  //  console.log('home');
  // console.log("getViews",this.navCtrl.getViews());
  // console.log("getActive",this.navCtrl.getActive());
  // console.log("getPrevious",this.navCtrl.getPrevious());
  // console.log("last",this.navCtrl.last());
  // console.log("first",this.navCtrl.first());
 }
}
