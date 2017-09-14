
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http';
import { Loading } from "ionic-angular";
import { not, isEmpty, compose } from "ramda";
const USER_ID = 'user_id';
export class MroUtils {
  static PAGINATION = 10;//列表每次显示的条目数量
  static generatePostReqArgs(token: string): RequestOptionsArgs {
    const reqOpt = new RequestOptions();
    reqOpt.headers = new Headers();
    reqOpt.headers.append('tokenId', token);
    return reqOpt;
  }
  static isNotEmpty = compose(not, isEmpty);
  static setLoginUserId(id: string | number) {
    return window.localStorage.setItem(USER_ID, id + "");
  }
  static getLastLoginUserId(): number {
    return window.localStorage.getItem(USER_ID) ? +window.localStorage.getItem(USER_ID) : null;
  }
  static changeDbRecord2Array(dbRes: any) {
    const res = [];
    if (dbRes.rows && dbRes.rows.length > 0) {
      for (let i = 0; i < dbRes.rows.length; i++) {
        res.push(dbRes.rows.item(i));
      }
    }
    return res;
  }
}
