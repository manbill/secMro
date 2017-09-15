import { tableNames } from './../../providers/db-operation/mro.tables';
import { ActionsObservable, combineEpics } from 'redux-observable';
import { AppState, EpicDependencies } from '../../app/app.reducer';
import { Action, Store } from 'redux';
import * as MaterialActions from "./material.actions";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
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
import 'rxjs/add/operator/takeLast';
import * as R from "ramda";
import { Loading } from 'ionic-angular';
import { loadMoreMaterialsComplete, loadMoreMaterials } from './material.actions';
import { MaterialState } from './material.reducer';
import { BaseDataStateTypes } from '../base-data.actions';
import { LOGIN_SUCCESS } from '../../user/user.actions';



export const fetchMaterialsEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  let curServerTime = Date.now();
  const pagination = deps.pagination;//物料列表，每次获取的数量
  return action$.ofType(MaterialActions.FETCH_MATERIAL_DATA, LOGIN_SUCCESS)
    .switchMap(() => {
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_actions} where syncAction=?`, [MaterialActions.FETCH_MATERIAL_DATA])
        .map(res => {
          const result = MroUtils.changeDbRecord2Array(res);
          if (result.length > 0) {
            return (result[0]['lastSyncSuccessTime'] || 0)
          } else {
            return 0;
          }
        })
    })
    .do(res => { console.log(res) })
    .map(time => 0)
    .switchMap(lastSyncTime => {
      const loading = deps.loading.create();
      loading.setContent('获取服务器时间...');
      loading.present();
      return deps.http.get(deps.mroApis.getCurServerTimeApi).map((res: MroResponse) => res.data)
        .do(() => loading.dismiss())
    }, (lastSyncTime, serverTime) => ({ lastSyncTime, serverTime }))
    .switchMap(({ lastSyncTime, serverTime }) => {
      const loading = deps.loading.create();
      loading.setContent('正在下载物料...');
      loading.present();
      curServerTime = serverTime;
      const params = {
        startDate: lastSyncTime,
        endDate: serverTime,
        page: 1
      }
      const repeat$ = new Subject();
      const bufferCount = 10;//批量操作,这里是1000的倍数，后台每次返回1000条物料
      const maxRetryCount = 3;
      const retryIntervalTime = 2000;//每2秒尝试重新获取物料信息
      return Observable.empty().startWith('getMaterials')
        .do(() => console.log('物料下载参数', params))
        .switchMap(() => deps.http.post(deps.mroApis.fetchMaterialApi, params))
        .repeatWhen(() => repeat$.asObservable())
        .retryWhen((err$) => Observable
          .range(0, maxRetryCount)
          .zip(err$, (i, err) => ({ i, err }))
          .mergeMap(({ i, err }) => {
            if (i === maxRetryCount - 1) {
              return Observable.throw(err);
            }
            return Observable.timer(i * retryIntervalTime);
          })
        )
        .map((res: MroResponse) => {
          if (res.data && res.data.length > 0) {
            params.page++;
            setTimeout(() => {
              repeat$.next()
            }, 0);
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
          console.log('materials', materials.length);
          sqls.push(`delete from  ${tableNames.eam_sync_material} where materialId in (${materials.map(m => m.materialId)})`);
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
          return deps.db.sqlBatch(sqls)
            .do(() => {
              console.log("完成一次物料批量更新数据库操作");
            })
        })
        .takeLast(1)
        .do(() => loading.dismiss())
        .catch(e => {
          loading.dismiss();
          return Observable.throw(e);
        });
    })
    .do(() => console.log("完成所有物料缓存操作"))
    .switchMap(() => {
      const materialState: MaterialState = {
        ids: [],
        isCompleted: true,
        materialEntities: {}
      }
      const sqls = [[`update ${tableNames.eam_sync_actions} set lastSyncSuccessTime=?,syncStatus=? where syncAction=?`, [curServerTime, 1, MaterialActions.FETCH_MATERIAL_DATA]]];
      sqls.push([`update ${tableNames.eam_sync_base_data_state} set stateJson=? where type=?`, [JSON.stringify(materialState), BaseDataStateTypes.materialStatetype.type]])
      return deps.db.sqlBatch(sqls);
    })
    .mapTo(MaterialActions.fetchMaterialDataCompleted())
    .catch(e => {
      console.error(e);
      let err = new MroError(MroErrorCode.fetch_dictionary_error_code, '获取物料信息失败', JSON.stringify(e));
      return Observable.of(generateMroError(err));
    })
}
export const doRefreshMaterialDataEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(MaterialActions.DO_REFRESH_MATERIALS)
    .mapTo(MaterialActions.fetchMaterialData())
}
export const loadMoreMaterialsEpic = (action$: ActionsObservable<Action>, store: Store<AppState>, deps: EpicDependencies) => {
  return action$.ofType(MaterialActions.LOAD_MORE_MATERIALS)
    .switchMap((action) => {
      const searchParams = (<MaterialActions.LoadMoreMaterialsAction>action).searParams;
      const skipRecords = deps.pagination * (searchParams.pageNumber - 1);
      let where = '';
      const values = [];
      if (MroUtils.isNotEmpty(searchParams.params.materialSno)) {
        where += ' and materialSno like ? ';
        values.push(`%${searchParams.params.materialSno}%`);
      }
      if (MroUtils.isNotEmpty(searchParams.params.materialName)) {
        where += ` and materialName like ? `;
        values.push(`%${searchParams.params.materialName}%`);
      }
      values.push(skipRecords);
      return deps.db.executeSql(`select * from ${tableNames.eam_sync_material} where 1=1 ${where} limit ?,${deps.pagination}`, values)
        .map(res => MroUtils.changeDbRecord2Array(res))
    })
    .map((materials) => MaterialActions.loadMoreMaterialsComplete(materials));
}
export const MaterialEpics = combineEpics(fetchMaterialsEpic, doRefreshMaterialDataEpic, loadMoreMaterialsEpic);
