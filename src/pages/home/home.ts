import { UserState } from './../../user/user.reducer';
import { Store, Unsubscribe } from 'redux';
import { AppState } from '../../app/app.reducer';
import { AppStore } from '../../app/app.store';
import { Component,Inject,OnInit } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  unsubscribe:Unsubscribe;
  projectName:string;
  companyName:string;
  constructor(private navCtrl: NavController,
    @Inject(AppStore)private store:Store<AppState>,
    private navParams: NavParams) {
     this.unsubscribe= store.subscribe(()=>{
        this.companyName=store.getState().userState.companyState.selectedCompany.companyName;
        this.projectName = store.getState().userState.projectState.selectedProject.projectName;
      })
  }
 ionViewDidLoad(){
  //  console.log('home');
  // console.log("getViews",this.navCtrl.getViews());
  // console.log("getActive",this.navCtrl.getActive());
  // console.log("getPrevious",this.navCtrl.getPrevious());
  // console.log("last",this.navCtrl.last());
  // console.log("first",this.navCtrl.first());
 }
 ionViewDidLeave(){
  console.debug("ionViewDidLeave");
  this.unsubscribe&&this.unsubscribe();
 }
}
