import { Api_getMachineList } from './../api/api';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as Apis from "../api/api";
/*
  Generated class for the MroApiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
export interface MroApiEntities {
  loginApi: string;
  logoutApi: string;
  fetchProjectsApi: string;
  fetchCompaniesApi: string;
  fetchWarehouse: string;
  fetchDictionaryApi: string;
  getCurServerTimeApi: string;
  fetchMaterialApi: string;
  fetchManualInstrutorApi: string;
  uploadWorkOrdersApi: string;
  uploadFilesApi: string;
  getBatchWorkorderListApi: string;
  getWorkorderFullInfoListApi: string;
  fetchMachineList: string;
  fetchMachineDetails: string;
}
@Injectable()
export class MroApiProvider {
  mroApiEntities: MroApiEntities = {
    loginApi: Apis.Api_login,
    logoutApi: Apis.Api_logout,
    fetchCompaniesApi: "todo",
    fetchProjectsApi: Apis.Api_getUserProject,
    fetchWarehouse: Apis.Api_getWarehouse,
    fetchDictionaryApi: Apis.Api_getDictionaryDetail,
    getCurServerTimeApi: Apis.Api_getSystemTime,
    fetchMaterialApi: Apis.Api_getMaterial,
    fetchManualInstrutorApi: Apis.Api_get_common_manual_url,
    uploadFilesApi: Apis.Api_updateUploadFiles,
    uploadWorkOrdersApi: Apis.Api_uploadWorkOrder,
    getBatchWorkorderListApi: Apis.Api_getBatchWorkorderList,
    getWorkorderFullInfoListApi: Apis.Api_getWorkorderFullInfoList,
    fetchMachineList: Apis.Api_getMachineList,
    fetchMachineDetails: Apis.Api_getEquipmentsTreeAndDetails
  }
  constructor() {
  }

}
