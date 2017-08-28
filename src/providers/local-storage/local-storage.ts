import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocalStorageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
const  USER_ID='USER_ID';
@Injectable()
export class LocalStorageProvider {

  constructor() {
    console.log('Hello LocalStorageProvider Provider');
  }
   getLastLoginUserId(){
    return window.localStorage.getItem(USER_ID)?+window.localStorage.getItem(USER_ID):null;
  }
   setLoginUserId(id:string|number){
    return window.localStorage.setItem(USER_ID,id+"");
  }
}
