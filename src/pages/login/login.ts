import { Component, Inject } from '@angular/core';
import { Http,RequestOptionsArgs,RequestOptions,Headers } from "@angular/http";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { ajax } from 'rxjs/observable/dom/ajax';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import * as Apis from "../../providers/api/api";
import { Api_login } from '../../providers/api/api';




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
  constructor(public navCtrl: NavController,
    private fb: FormBuilder,
    private http: Http,
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
    console.log(Apis.Api_login, {
      userName: this.loginForm.get('userName').value,
      password: this.loginForm.get('password').value,
      deviceFlag: 2
    });
    // ajax.post(this.loginApi,{username:'10780326',password:'123456',flag:2})
    // .subscribe(res=>console.log,e=>console.error,()=>console.log("doneeeee"));
    this.http.post(Apis.Api_login, {
      userName: this.loginForm.get('userName').value,
      password: this.loginForm.get('password').value,
      deviceFlag: 2
    })
      .do(res => console.debug(res.json().data))
      .switchMap(
      (res) => {
        const params = new Headers();
        const reqArg = new RequestOptions();
        reqArg.headers=params;
        reqArg.headers.append("tokenId",res.json()['data']['token']);
        console.debug("token",reqArg);
        return this.http.post(Apis.Api_getUserProject,{},reqArg)
      }
      )
      .do(res => console.debug)
      .subscribe(
      res => {
        console.debug(res.json());
      },
      e => {
        console.error(e);
      },
      () => console.log("done")
      );
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
