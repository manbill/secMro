import { Reducer,combineReducers,compose } from "redux";
import { UserState,UserReducer } from "../user/user.reducer";
import { ProjectState } from "../project/project.reducer";
import { CompanyState } from "../company/company.reducer";
import { WorkOrdersState } from "../work-orders/work-orders.reducer";
import { NotificationOrdersState } from "../notification-order/notification-order.reducer";
export interface AppState{
  currentUser:UserState,//当前登录用户
  currentProject:ProjectState,//当前选择的项目
  currentCompany:CompanyState,//当前选择的公司
  workOrders:WorkOrdersState,//工单模块(计划工单、技改工单、安装调试、故障工单),
  notificationOrders:NotificationOrdersState,//通知单
}
const rootReducer:Reducer<AppState >=combineReducers<AppState>({

})
export default rootReducer;
