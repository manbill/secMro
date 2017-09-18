import { FETCH_FAN_MACHINE_EQUIPMENTS_DATA } from './fan-equipments/fan.actions';
import { FETCH_FAULT_ORDER_DATA } from './work-orders/fault-order/fault-order.actions';
import { FETCH_MAINTENANCE_TASK_DATA } from './work-orders/planned-work-order/maintenance-orders/maintenance-order.actions';
export const BusinessDataSyncActions = [
  FETCH_MAINTENANCE_TASK_DATA,
  FETCH_FAULT_ORDER_DATA,
  FETCH_FAN_MACHINE_EQUIPMENTS_DATA
]
//	工单类型(查询时// :pc端:37-风云工单,38-人工工单,39-工程工单,67-服务工单,68-整改/技改工单;手机端:4-scada工单；返回时，都是按照pc端的);传入空字符串，返回所有类型工单
export interface IBusinessWorkOrderDataSyncActionsEntities {
  [action: string]: {
    type: string;
    workorderTypeString: string;
  }
}
export const BusinessWorkOrderDataSyncActionsEntities: IBusinessWorkOrderDataSyncActionsEntities = {
  [FETCH_MAINTENANCE_TASK_DATA]: {
    type: FETCH_MAINTENANCE_TASK_DATA,
    workorderTypeString: '67'//定维
  },
  [FETCH_FAULT_ORDER_DATA]: {
    type: FETCH_FAULT_ORDER_DATA,
    workorderTypeString: '37,38'//人工填报故障工单
  }
}
