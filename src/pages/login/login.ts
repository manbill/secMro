import { SelectCompanyProjectPage } from './../select-company-project/select-company-project';
import { User } from './../../user/user.modal';
import { TabsPage } from './../tabs/tabs';
import { AppStore } from './../../app/app.store';
import { Store, Unsubscribe } from 'redux';
import { AppState } from './../../app/app.reducer';
import { Component, Inject, OnDestroy } from '@angular/core';
import { Http, RequestOptionsArgs, RequestOptions, Headers } from "@angular/http";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { ajax } from 'rxjs/observable/dom/ajax';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/delay';
import { Observable } from 'rxjs/Observable';
import * as Apis from "../../providers/api/api";
import { Api_login } from '../../providers/api/api';
import { userLogin } from "../../user/user.actions";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { setNavCtrl } from "../../app/app.actions";




/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  unsubscription: Unsubscribe;
  constructor(private navCtrl: NavController,
    private fb: FormBuilder,
    private http: Http,
    @Inject(AppStore) private store: Store<AppState>,
    public navParams: NavParams) {
    this.createForm();
  }
  createForm() {
    this.loginForm = this.fb.group({
      userName: ['10780326', Validators.required],
      password: ['123456', Validators.required]
    });
  }
  login() {
    let actionCount = 0;
    console.log(Apis.Api_login, {
      userName: this.loginForm.get('userName').value,
      password: this.loginForm.get('password').value,
      deviceFlag: 2
    });
    this.store.dispatch(setNavCtrl(this.navCtrl));
    this.store.dispatch(userLogin(
      {
        userName: this.loginForm.get('userName').value,
        password: this.loginForm.get('password').value,
        deviceFlag: 2
      }
    )
    );
    let count = 0;
    this.unsubscription = this.store.subscribe(() => {
      console.log(this.store.getState().currentUser.currentUser.realname,++count);
    });
    this.navCtrl.push(SelectCompanyProjectPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  ionViewDidLeave() {
    console.log('ionViewDidLeave LoginPage');
    this.unsubscription();
  }

}
