import { AppState } from './app.reducer';
import { LoginPage } from './../pages/login/login';
import { Action } from 'redux';
import { ActionCreator, Store } from 'redux';
import { IonicErrorHandler, LoadingController, App, Loading, AlertController } from 'ionic-angular';
import { Inject, Provider, ErrorHandler, Injectable, Injector } from "@angular/core";
import { inspect } from "util";
import { AppStore } from './app.store';
import { errorsHandledCompleted } from "./app.actions";
export class MroErrorHandler extends IonicErrorHandler {
  store: Store<AppState>;
  constructor(@Inject(Injector)private injector: Injector, @Inject(LoadingController) private loadingCtrl: LoadingController, @Inject(AlertController) private alert: AlertController) {
    super();
    this.store = injector.get<Store<AppState>>(AppStore);
  }
  handleError(errors: MroError[]) {
    console.error(errors);
    if (errors.length > 0) {
      const errorAlert = this.alert.create({
        title: '错误提示',
        subTitle: '错误信息',
        message: `${errors.map(err => err.errorMessage + "<br/>")}`,
        buttons: [{
          text: '确定',
          handler: () => {
            this.store.dispatch(errorsHandledCompleted());
            console.log('错误处理,完成');
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('错误处理取消');
            this.store.dispatch(errorsHandledCompleted());
          }
        }
        ]
      });
      errorAlert.present();
    }
  }
  isMroError(mroError: any): mroError is MroError {
    return mroError instanceof MroError ||
      "errorCode" in mroError && "errorMessage" in mroError;
  }
}
export class MroError {
  constructor(errorCode: number, errorMessage: string, errorReason?: any) {
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.errorReason = errorReason;
  }
  errorCode: number;
  errorMessage: string;
  errorReason: any;
}
export enum MroErrorCode {
  network_error_code = 0x00001,//网络错误
  token_invalid_error_code,
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
  fetch_material_error_code,//字典
  load_more_material_error_code,//字典
  user_login_error_code,
  user_info_db_upsert_error_code,
  user_info_db_update_error_code,
  fetch_projects_error_code,
  fetch_warehouse_error_code,
  generate_mro_error_code
}
export const MroErrorHandlerProvider: Provider =
  { provide: ErrorHandler, useClass: MroErrorHandler }
