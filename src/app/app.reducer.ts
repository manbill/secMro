import { Reducer,combineReducers,compose } from "redux";
import { UserState, UserReducer } from '../user/user.reducer';
import { ProjectState,ProjectReducer } from "../project/project.reducer";
import { CompanyState } from "../company/company.reducer";
import { WorkOrdersState } from "../work-orders/work-orders.reducer";
import { NotificationOrdersState } from "../notification-order/notification-order.reducer";
import { CompanyReducer } from '../company/company.actions';
export interface AppState{
  currentUser:UserState,//当前登录用户
  project:ProjectState,//当前选择的项目
  currentCompany:CompanyState,//当前选择的公司
  // workOrders:WorkOrdersState,//工单模块(计划工单、技改工单、安装调试、故障工单),
  // notificationOrders:NotificationOrdersState,//通知单
}
const rootReducer:Reducer<AppState >=combineReducers<AppState>({
  currentUser:UserReducer,//当前登录用户
  project:ProjectReducer,//当前选择的项目
  currentCompany:CompanyReducer,//当前选择的公司
  // workOrders:WorkOrdersState,//工单模块(计划工单、技改工单、安装调试、故障工单),
  // notificationOrders:NotificationOrdersState,//通知单
})
export default rootReducer;
