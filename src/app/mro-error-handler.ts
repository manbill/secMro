import { Action } from 'redux';
import { ActionCreator } from 'redux';
import { IonicErrorHandler, LoadingController } from "ionic-angular";
import { Inject } from "@angular/core";
import { inspect } from "util";
export class MroErrorHandler extends IonicErrorHandler {
  constructor(@Inject(LoadingController)private loading: LoadingController) { super() }
  handleError(error: any) {
    console.error(error);
    if (this.isMroError(error)) {
      switch (error.errorCode) {
        case MroErrorCode.network_error_code: {
          alert("网络错误,原因：" + error.errorMessage);
          break;
        }
      }
    } else {
      this.loading.create({
        content: '异常错误:<br/>' + inspect(error, { depth: 3 }),
        duration: 1000,
        enableBackdropDismiss: true
      }).present();
    }
  }
  isMroError(mroError: any): mroError is MroError {
    return mroError instanceof MroError ||
      "errorCode" in mroError && "errorMessage" in mroError;
  }
}
export class MroError {
  constructor(errorCode:number,errorMessage:string,errorReason?:any){
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.errorReason = errorReason;
  }
  errorCode: number;
  errorMessage: string;
  errorReason:any;
}
export enum MroErrorCode {
  network_error_code = 0x00001,//网络错误
  planned_order_info_upload_error_code,//计划工单信息上传失败
  planned_order_db_insert_failed_error_code,//计划工单信息写入数据库失败
  planned_order_db_update_failed_error_code,//计划工单信息更新数据失败
  planned_order_file_mapping_upload_error_code,//计划工单和附件关联失败
  fault_order_info_upload_error_code,//故障工单信息上传失败
  fault_order_db_insert_failed_error_code,//故障工单信息写入数据库失败
  fault_order_db_update_failed_error_code,//故障工单信息更新数据库失败
  fault_order_file_mapping_upload_error_code,//故障工单附件关联失败
  attached_file_upload_error_code,//附件上传失败
  work_hours_upload_error_code,//工时填报上传失败
  work_hours_db_insert_error_code,
  work_hours_db_update_error_code,
  transfer_order_upload_error_code,//调拨单上传失败
  dictionary_db_insert_error_code,//字典
  dictionary_db_update_error_code,//字典
  fetch_dictionary_error_code,//字典
  user_login_error_code,
  user_info_db_upsert_error_code,
  user_info_db_update_error_code,
  fetch_projects_error_code,
  fetch_warehouse_error_code
}
export const GENERATE_MRO_ERROR='generate_mro_error';
export const HANDLED_ERROR="handled_error";
export function errorHandled():Action{
  return {
    type:HANDLED_ERROR
  }
}
export interface GenerateMroErrorAction extends Action{
  error:MroError
}
export function generateMroError(e:MroError):GenerateMroErrorAction{
  return {
    type:GENERATE_MRO_ERROR,
    error:e
  }
}
