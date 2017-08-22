import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from "ionic-angular";
import { SQLite, SQLiteDatabaseConfig, SQLiteObject } from "@ionic-native/sqlite";

/*
  Generated class for the DbOperationProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DbOperationProvider {

  constructor( @Inject(SQLite) private sqlite: SQLite,
    @Inject(Platform) private plt: Platform) {
    console.log('Hello DbOperationProvider Provider',plt.is("mobile"));
  }

}
