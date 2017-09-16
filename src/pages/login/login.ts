import { MroUtils } from './../../common/mro-util';
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
import { Subject } from "rxjs/Subject";
import { login } from "../../user/user.actions";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';




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
      userName: ['10700510', Validators.required],
      password: ['123456', Validators.required]
    });
  }
  login() {
    this.store.dispatch(login(
      {
        userName: this.loginForm.get('userName').value,
        password: this.loginForm.get('password').value,
        deviceFlag: 2
      }
    )
    );
    this.unsubscription = this.store.subscribe(() => {
      //do nothing;
    });
    //登录用户改变，或者是尚未选择项目
    if(this.store.getState().userState.currentUser&&
      this.store.getState().userState.currentUser.id!==MroUtils.getLastLoginUserId()
    || !this.store.getState().userState.projectState.selectedProject
    ){
      console.log('重新选择项目')
      this.navCtrl.push(SelectCompanyProjectPage);
      return ;
    }
    this.navCtrl.push(TabsPage);//跳转到首页
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  ionViewDidLeave() {
    console.log('ionViewDidLeave LoginPage');
    this.unsubscription&&this.unsubscription();
  }

}
