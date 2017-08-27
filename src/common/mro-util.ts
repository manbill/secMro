
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http';
import { Loading } from "ionic-angular";
const USER_ID='USER_ID';
export class MroUtils {
  static generatePostReqArgs(token:string):RequestOptionsArgs{
    const reqOpt = new RequestOptions();
    reqOpt.headers = new Headers();
    reqOpt.headers.append('tokenId',token);
    return reqOpt;
  }
  static dismissLoading(loading:Loading){
    console.log("loading.isOverlay",loading.isOverlay);
      if(loading){
        loading.dismiss();
      }
  }
  static getLastLoginUserId(){
    return window.localStorage.getItem(USER_ID);
  }
  static setLoginUserId(id:string){
    return window.localStorage.setItem(USER_ID,id);
  }
}
