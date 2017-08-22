import { Component,Inject } from '@angular/core';
import { Http } from "@angular/http";
import { API_LOGIN} from "../../providers/api/api";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { ajax } from 'rxjs/observable/dom/ajax';



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
    @Inject(API_LOGIN)private loginApi:string,
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
    console.log(this.loginApi,{
      username: this.loginForm.get('userName').value,
      password: this.loginForm.get('password').value,
      flag: 2
    });
    // ajax.post(this.loginApi,{username:'10780326',password:'123456',flag:2})
    // .subscribe(res=>console.log,e=>console.error,()=>console.log("doneeeee"));
   this.http.post(this.loginApi, {
      username: this.loginForm.get('userName').value,
      password: this.loginForm.get('password').value,
      flag: 2
    })
      .subscribe(
      res => {
        console.debug(res);
      },
      e => {
        console.error(e);
      },
      ()=>console.log("done")
    );
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
