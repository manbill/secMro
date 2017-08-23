import { Observable } from 'rxjs/Observable';
import { Project } from './../../project/project.modal';
import { Injectable, Inject, Provider } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from "ionic-angular";
import { SQLite, SQLiteDatabaseConfig, SQLiteObject } from "@ionic-native/sqlite";
import 'rxjs/add/observable/fromPromise';


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
  constructor(@Inject(SQLite)private sqlite: SQLite ) {
    console.log('Hello DbOperationProvider Provider', sqlite);
  }
  executeSql(sql: string, params?: any) {
    console.log(!window['cordova']);
    if (!window['cordova']) {//电脑上
      const db = window['openDatabase'](dbConfig.name, "", "", 1024 * 1024 * 100, f=>f);;
      // console.debug(db);
      return new Observable(observer => {
        db.transaction( (tx)=> {
          tx.executeSql(sql, params,(tranx,result)=>{
            observer.next(result);
          },(tranx,error)=>{
            observer.error(error);
          });
        },  (error) =>{
          observer.error(error);
        },  ()=> {
          observer.next();
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
    if (!window['cordova']) {//电脑上
      const db = window['openDatabase'](dbConfig);
      return new Observable(observer => {
        db.transaction( (tx) =>{
          const records = sqlStatements.slice(0);
          (function insertOne() {
            let record = records.slice(0, 1);
            try {
              if (typeof record === 'string') {
                tx.executeSql(record, null,  (tx, result)=> {
                  if (records.length === 0) {
                    observer.next(result);
                  } else {
                    insertOne();
                  }
                },  (transaction, error) =>{
                  observer.error(error);
                  return;
                });
              } else if (record.length === 2) {
                tx.executeSql(record[0], record[1],  (tx, result) =>{
                  if (records.length === 0) {
                    observer.next(result);
                  } else {
                    insertOne();
                  }
                },  (transaction, error)=> {
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
        },  (error)=> {
          observer.error(error);
        },  ()=> {
          observer.next();
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
}

