import { createStore, Store, compose, StoreEnhancer } from "redux";
import { AppState } from "./app.reducer";
import { InjectionToken } from "@angular/core";
export const AppStore=new InjectionToken('App.store');
const devTools :StoreEnhancer<AppState>=window['__REDUX_DEVTOOLS_EXTENSION__']?window['__REDUX_DEVTOOLS_EXTENSION__']:f=>f;
