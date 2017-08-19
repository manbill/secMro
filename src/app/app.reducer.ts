import { Reducer,combineReducers } from "redux";
import { UserState } from "../user/user.reducer";
import { WorkOrdersState } from "../work-orders/work-orders.reducer";
export interface AppState{
  user:UserState,
  ordersState:WorkOrdersState
}
const rootReducer:Reducer<AppState >=combineReducers<AppState>({
  user:null,
  ordersState:null
})
export default rootReducer;
