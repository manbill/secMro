import { initAppStore } from './../../app/app.actions';
import { UserState } from './../../user/user.reducer';
import { Store } from 'redux';
import { AppState } from './../../app/app.reducer';
import { AppStore } from './../../app/app.store';
import { Component,Inject,OnInit } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  ngOnInit(): void {
    const userState:UserState= this.navParams.get('userState');
    console.log(userState);
    this.store.dispatch(initAppStore(this.navCtrl, userState));
    this.store.subscribe(() => {
      console.log("store 正在初始化...");
    })
  }
  constructor(private navCtrl: NavController,
    private navParams: NavParams, @Inject(AppStore) private store: Store<AppState>) {

  }
 ionViewDidLoad(){
   console.log('home');
 }
}
