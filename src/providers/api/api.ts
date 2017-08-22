import { InjectionToken,Provider } from '@angular/core';
import 'rxjs/add/operator/map';
 const baseUrl = 'https://mroqas.shanghai-electric.com/eam-web/EamApi';
 const Api_login= baseUrl+ "/common/user/login.api";
 const Api_getUpgradeVersionInfo=baseUrl+"/common/getUpgradeVersionInfo.api";
 const Api_logout = "/api/user/logout.api";
 const Api_getUserProject = "/api/user/getUserProject.api";
 const Api_getProfileInfo = "/api/user/getProfileInfo.api";
export const API_LOGIN=new InjectionToken("API_LOGIN");
export const apiProviders:Provider[]=[
  {
    provide:API_LOGIN,useValue:Api_login
  }
]
