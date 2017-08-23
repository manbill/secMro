import { InjectionToken,Provider } from '@angular/core';
import 'rxjs/add/operator/map';
//  const baseUrl = 'https://mroqas.shanghai-electric.com/eam-web/EamApi';
 const baseUrl = 'http://10.54.134.64:8080/EamApi';
export const Api_login= baseUrl+ "/common/user/login.api";
export const Api_getUserProject = baseUrl + "/api/user/getUserProject.api"
export const Api_getUpgradeVersionInfo=baseUrl+"/common/getUpgradeVersionInfo.api";
export const Api_logout = "/api/user/logout.api";
export const Api_getProfileInfo = "/api/user/getProfileInfo.api";
