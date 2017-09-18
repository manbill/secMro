import { CreateFaultOrderPageModule } from './../pages/create-fault-order/create-fault-order.module';
import { MaintenanceOrdersPageModule } from './../pages/maintenance-orders/maintenance-orders.module';
import { InventoriesPage } from './../pages/inventories/inventories';
import { SelectCompanyProjectPage } from './../pages/select-company-project/select-company-project';
import { MroAppStoreProvider } from './app.store';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MroErrorHandler,MroErrorHandlerProvider } from "./mro-error-handler";
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from "../pages/login/login";
import {Http,HttpModule} from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from "@ionic-native/sqlite";
import { SplashScreen } from '@ionic-native/splash-screen';
import { ReactiveFormsModule } from "@angular/forms";
import { DbOperationProvider } from '../providers/db-operation/db-operation';
import { MroApiProvider } from '../providers/mro-api/mro-api';
import { HttpInterceptorModule } from "ng-http-interceptor";
import { FaultOrderPageModule } from '../pages/fault-order/fault-order.module';
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    InventoriesPage,
    HomePage,
    TabsPage,
    LoginPage,
    SelectCompanyProjectPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
    HttpInterceptorModule,
    MaintenanceOrdersPageModule,
    FaultOrderPageModule,
    CreateFaultOrderPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    InventoriesPage,
    AboutPage,
    HomePage,
    LoginPage,
    SelectCompanyProjectPage
  ],
  providers: [
    MroErrorHandlerProvider,
    StatusBar,
    SQLite,
    SplashScreen,
    DbOperationProvider,
    MroApiProvider,
    MroAppStoreProvider,
  ]
})
export class AppModule {}
