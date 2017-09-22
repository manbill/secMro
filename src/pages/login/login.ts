import { Platform } from 'ionic-angular';
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
import { MroUtils } from '../../common/mro-util';
import { getUserProjects, getCurrentUser } from '../../user/user.reducer';
import { selectProject } from '../../project/project.actions';




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
  unsubscribe: Unsubscribe;
  constructor(private navCtrl: NavController,
    private fb: FormBuilder,
    private http: Http,
    private plt: Platform,
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
        deviceFlag: this.plt.is('ios') ? 1 : 2
      }
    ));
    // this.navCtrl.push(SelectCompanyProjectPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  ionViewDidLeave() {
    console.log('ionViewDidLeave LoginPage');

  }
  ngOnInit() {
    let isJumpPage = false;
    this.unsubscribe = this.store.subscribe(() => {
      if (getUserProjects(this.store.getState()).length !== 0 && this.store.getState().userState.tokenState.isTokenValid) {//如果登录成功且下载项目成功
        console.log('登录且成功下载项目信息');
        this.unsubscribe();
        if (!isJumpPage) {
          isJumpPage = true;
          if (getUserProjects(this.store.getState()).length === 1) {
            this.store.dispatch(selectProject(getUserProjects(this.store.getState())[0]));
            console.log('一个项目，直接跳转到首页');
            this.navCtrl.setRoot(TabsPage);
            return;
          }
          console.log('跳转到选择项目界面', isJumpPage);
          this.navCtrl.push(SelectCompanyProjectPage);
        }
      }
    })
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('loginPage destroy')
    this.unsubscribe();
  }
}
