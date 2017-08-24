import { SqlVersions, tableNames } from './mro.tables';
import { Observable } from 'rxjs/Observable';
import { Project } from './../../project/project.modal';
import { Injectable, Inject, Provider } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Platform } from "ionic-angular";
import { SQLite, SQLiteDatabaseConfig, SQLiteObject } from "@ionic-native/sqlite";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/empty';



/*
  Generated class for the DbOperationProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
const dbConfig: SQLiteDatabaseConfig = {
  name: 'mro.20170823.db',
  location: 'default'
}
@Injectable()
export class DbOperationProvider {
  constructor( @Inject(SQLite) private sqlite: SQLite) {
    // console.log('Hello DbOperationProvider Provider', sqlite);
  }
  executeSql(sql: string, params?: any) {
    if (!window['cordova']) {//电脑上
      const db = window['openDatabase'](dbConfig.name, "", "", 1024 * 1024 * 100, console.log);
      return new Observable(observer => {
        db.transaction((tx) => {
          tx.executeSql(sql, params, (tranx, result) => {
            observer.next(result);
            observer.complete();
          }, (tranx, error) => {
            observer.error(error);
          });
        }, (error) => {//transaction error
          observer.error(error);
        }, () => {//transaction success
          observer.complete();
        });
        return () => observer.unsubscribe;
      });
    }
    return Observable.fromPromise(
      this.sqlite
        .create(dbConfig)
        .then(
        (db: SQLiteObject) => db.executeSql(sql, params))
    );
  };
  /**
   * db.sqlBatch([
    'CREATE TABLE IF NOT EXISTS DemoTable (name, score)',
    [ 'INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101] ],
    [ 'INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202] ],
  ], function() {
    console.log('Populated database OK');
  }, function(error) {
    console.log('SQL batch ERROR: ' + error.message);
  });
   * @param sqlStatements
   */
  sqlBatch(sqlStatements: Array<string | string[] | any>) {
    if (!sqlStatements) {
      throw new Error("请传入参数 sqlStatements");
    }
    if (sqlStatements.length === 0) {
      return Observable.empty();
    }
    if (!window['cordova']) {//电脑上
      let records = sqlStatements.slice(0);
      const db = window['openDatabase'](dbConfig.name, "", "", 1024 * 1024 * 100, console.log);
      return new Observable(observer => {
        db.transaction((tx) => {
          (function insertOne() {
            let record = records.splice(0, 1)[0];
            // console.debug(record, records.length);
            try {
              if (typeof record === 'string') {
                tx.executeSql(record, null, (tx, result) => {
                  if (records.length === 0) {
                    observer.next(result);
                    observer.complete();
                  } else {
                    insertOne();
                  }
                }, (transaction, error) => {
                  observer.error(error);
                  return;
                });
              } else if (record.length === 2) {
                tx.executeSql(record[0], record[1], (tx, result) => {
                  if (records.length === 0) {
                    observer.next(result);
                    observer.complete();
                  } else {
                    insertOne();
                  }
                }, (transaction, error) => {
                  observer.error(error);
                  return;
                });
              } else {
                throw new Error("请传递正确格式的sqls");
              }
            } catch (exception) {
              observer.error(exception);
            }
          })()
        });
        return () => observer.unsubscribe;
      });
    }
    return Observable.fromPromise(
      this.sqlite
        .create(dbConfig)
        .then(
        (db: SQLiteObject) => db.sqlBatch(sqlStatements))
    );
  }
  initSqlVersions() {
    const checksql = `SELECT * FROM sqlite_master where type='table' and name='eam_sql_version'`;
    return this.executeSql(checksql)
      .switchMap(res => {
        console.debug(res);
        let sqls = [];
        const lastestSqlVersion = SqlVersions[SqlVersions.length - 1].sqlVersion;
        const updateSqlver = `update  ${tableNames.eam_sql_version} set sqlVersion=?`;
        const inserSqlver = `insert into  ${tableNames.eam_sql_version} (sqlVersion) values(?)`;
        if (res.rows.length > 0) {
          return this.executeSql(`select * from ${tableNames.eam_sql_version}`)
            .map(res => {
              let lastSqlVer = res.rows.item(0)['sqlVersion'];
              console.debug("上一版sqlVersion:", lastSqlVer);
              sqls = SqlVersions
                .filter(sqlVer => sqlVer.sqlVersion > +lastSqlVer)
                .reduce((sqls, sqlVer) => sqls.concat(sqlVer.sqlStatements
                  .filter(sql => sql && sql !== '')
                ), []);
              return sqls;
            })
            .switchMap((sqls) => this.sqlBatch(sqls)
              .switchMap(() => this.executeSql(updateSqlver, [lastestSqlVersion])));
        } else {
          sqls = SqlVersions
            .reduce((sqls, sqlVer) => sqls.concat(sqlVer.sqlStatements
              .filter(sql => sql && sql !== '')
            ), []);
          return this.sqlBatch(sqls)
            .switchMap(() => this.executeSql(inserSqlver, [lastestSqlVersion]));
        }
      });

  }
}
