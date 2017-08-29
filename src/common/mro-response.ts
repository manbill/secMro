import {Response} from '@angular/http';
export interface MroResponse extends Response{
  data:any;
  retCode:any;
  retInfo:any;
}
