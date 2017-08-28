import { initAppStore } from './../../app/app.actions';
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
   console.log('home');
 }
}
