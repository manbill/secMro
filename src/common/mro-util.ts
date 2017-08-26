import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http';
export class MroUtils{
  static generatePostReqArgs(token:string):RequestOptionsArgs{
    const reqOpt = new RequestOptions();
    reqOpt.headers = new Headers();
    reqOpt.headers.append('tokenId',token);
    return reqOpt;
  }
}
