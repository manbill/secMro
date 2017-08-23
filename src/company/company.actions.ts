import {  CompanyState } from './company.reducer';
import { Action } from 'redux';
import * as CompanyActions from "./company.actions";
export const CompanyReducer=function(state:CompanyState,action:Action){
  switch(action.type){
    default:{
      return state;
    }
  }
}
