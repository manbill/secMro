import { ActionsObservable, combineEpics } from 'redux-observable';
import { AppState, EpicDependencies } from '../../app/app.reducer';
import { Action, Store } from 'redux';
import * as MaterialActions from "./material.actions";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { tableNames } from "../../providers/db-operation/mro.tables";
import { generateMroError, MroError, MroErrorCode } from '../../app/mro-error-handler';
import { MroUtils } from '../../common/mro-util';
import { MroResponse } from '../../common/mro-response';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/repeatWhen';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/zip';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';



export const fetchMaterialsEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(MaterialActions.FETCH_MATERIAL_DATA)
    .switchMap(() => {
      const loading = deps.loading.create({
        content: '下载物料...'
      });
      loading.present();
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_actions} where syncAction=?`, [MaterialActions.FETCH_MATERIAL_DATA])
        .map(res => MroUtils.changeDbRecord2Array(res)['lastSyncSuccessTime'] || 0)
        .do(() => loading.dismiss());
    })
    .do(res => { console.log(res) })
    .switchMap(lastSyncTime => {
      const loading = deps.loading.create({
        content: '获取服务器时间'
      });
      loading.present();
      return deps.http.get(deps.mroApis.getCurServerTimeApi).map((res: MroResponse) => res.data).do(() => loading.dismiss());
    }, (lastSyncTime, serverTime) => ({ lastSyncTime, serverTime }))
    .switchMap(({ lastSyncTime, serverTime }) => {
      console.log({ lastSyncTime, serverTime });
      const params = {
        startDate: lastSyncTime,
        endDate: serverTime,
        page: 1
      }
      const repeat$ = new Subject();
      const bufferCount = 1;//批量操作,这里是 10*1000
      const maxRetryCount = 3;
      const retryIntervalTime = 2000;//每2秒尝试重新获取物料信息
      const loading = deps.loading.create({
        content: '获取服务器时间'
      });
      loading.present();
      return Observable.empty().startWith('getMaterials')
        .do(() => loading.setContent("正在下载物料..."))
        .switchMap(() => deps.http.post(deps.mroApis.fetchMaterialApi, params))
        .repeatWhen(() => repeat$.asObservable())
        .retryWhen((err$) => Observable
          .range(0, maxRetryCount)
          .zip(err$, (i, err) => ({ i, err }))
          .mergeMap(({ i, err }) => {
            if (i === maxRetryCount - 1) {
              loading.dismiss();
              return Observable.throw(err);
            }
            return Observable.timer(i * retryIntervalTime);
          })
        )
        .map((res: MroResponse) => {
          if (res.data && res.data.length > 0) {
            params.page++;
            setTimeout(() => repeat$.next(), 0);
          } else {
            if (!res.data) {
              repeat$.error(res.retInfo);
            } else if (res.data.length === 0) {
              repeat$.complete();
            }
          }
          return res.data
        })
        .filter(values => values.length > 0)
        .bufferCount(bufferCount)
        .do(values => console.log(values))
        .mergeMap((values) => {
          const sqls = [];
          const materials = values.reduce((arr, item) => arr.concat(item), []);
          console.log('materials', materials);
          sqls.push(`delete from  ${tableNames.eam_sync_material} where materialId in ${materials.map(m => m.materialId)+""}`);
          const insertSql = `insert into ${tableNames.eam_sync_material}(
            materialId,
            materialName,
            unit,
            materialSno,
            materialType,
            materialTypeText,
            materialSuite,
            machine_model,
            materialFileid,
            materialValue,
            marterialExpiredate,
            materialComment,
            materialSupplier,
            materialFilePath,
            qrcodeFileid,
            materialQrFilePath,
            material_replace,
            comment,
            materialVendor,
            machineModel,
            machineModelId,
            materialReplace,
            activeFlag,
            sapInventoryFlag,
            json
          )values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
          materials.forEach(material => {
            const vals = [];
            vals.push(material.materialId);
            vals.push(material.materialName);
            vals.push(material.unit);
            vals.push(material.materialSno);
            vals.push(material.materialType);
            vals.push(material.materialTypeText);
            vals.push(material.materialSuite);
            vals.push(material.machine_model);
            vals.push(material.materialFileid);
            vals.push(material.materialValue);
            vals.push(material.marterialExpiredate);
            vals.push(material.materialComment);
            vals.push(material.materialSupplier);
            vals.push(material.materialFilePath);
            vals.push(material.qrcodeFileid);
            vals.push(material.materialQrFilePath);
            vals.push(material.material_replace);
            vals.push(material.comment);
            vals.push(material.materialVendor);
            vals.push(material.machineModel);
            vals.push(material.machineModelId);
            vals.push(material.materialReplace);
            vals.push(material.activeFlag);
            vals.push(material.sapInventoryFlag);
            vals.push(JSON.stringify(material));
            sqls.push([insertSql, vals]);
          });
          loading.setContent("正在缓存物料信息...");
          console.log(sqls)
          return deps.db.sqlBatch(sqls);
        })
        .do(() => loading.dismiss())
    })
    .switchMap(() => {
      const pagination = 10;
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_material} limit 0,${pagination}`)
        .map(res => MroUtils.changeDbRecord2Array(res))
    })
    .map(materials => MaterialActions.fetchMaterialDataCompleted(materials))
    .catch(e => {
      console.error(e);
      let err = new MroError(MroErrorCode.fetch_dictionary_error_code, '获取物料信息失败', JSON.stringify(e));
      return Observable.of(generateMroError(err));
    })
}
export const MaterialEpics = combineEpics(fetchMaterialsEpic);
