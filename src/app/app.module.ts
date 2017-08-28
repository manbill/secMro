import { SelectCompanyProjectPage } from './../pages/select-company-project/select-company-project';
import { AppStoreProvider } from './app.store';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MroErrorHandler } from "./mro-error-handler";
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from "../pages/login/login";
import {Http,HttpModule} from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from "@ionic-native/sqlite";
import { SplashScreen } from '@ionic-native/splash-screen';
import { ReactiveFormsModule } from "@angular/forms";
import { DbOperationProvider } from '../providers/db-operation/db-operation';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    SelectCompanyProjectPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    ContactPage,
    AboutPage,
    HomePage,
    LoginPage,
    SelectCompanyProjectPage
  ],
  providers: [
    StatusBar,
    SQLite,
    SplashScreen,
    {provide: ErrorHandler, useClass: MroErrorHandler},
    DbOperationProvider,
    LocalStorageProvider,
    AppStoreProvider
  ]
})
export class AppModule {}
