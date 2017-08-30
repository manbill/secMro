
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http';
import { Loading } from "ionic-angular";
const USER_ID='user_id';
export class MroUtils {
  static generatePostReqArgs(token:string):RequestOptionsArgs{
    const reqOpt = new RequestOptions();
    reqOpt.headers = new Headers();
    reqOpt.headers.append('tokenId',token);
    return reqOpt;
  }
   static setLoginUserId(id:string|number) {
    return window.localStorage.setItem(USER_ID,id+"");
  }
   static getLastLoginUserId():number {
    return window.localStorage.getItem(USER_ID)?+window.localStorage.getItem(USER_ID):null;
  }
}
