import { FETCH_SCADA_FAULT_ORDER_DATA, FETCH_MANUAL_FAULT_ORDER_DATA } from './work-orders/fault-order/fault-order.actions';
import { FETCH_MAINTENANCE_TASK_DATA } from './work-orders/planned-work-order/maintenance-orders/maintenance-order.actions';
export const BusinessDataSyncActions = [
  FETCH_MAINTENANCE_TASK_DATA,
  FETCH_MANUAL_FAULT_ORDER_DATA,
  FETCH_SCADA_FAULT_ORDER_DATA
]
//	工单类型(查询时// :pc端:37-风云工单,38-人工工单,39-工程工单,67-服务工单,68-整改/技改工单;手机端:4-scada工单；返回时，都是按照pc端的);传入空字符串，返回所有类型工单
export interface IBusinessDataSyncActionsEntities {
  [action: string]: {
    type: string;
    workorderTypeString: string;
  }
}
export const BusinessDataSyncActionsEntities: IBusinessDataSyncActionsEntities = {
  [FETCH_MAINTENANCE_TASK_DATA]: {
    type: FETCH_MAINTENANCE_TASK_DATA,
    workorderTypeString: '67'//定维
  },
  [FETCH_MANUAL_FAULT_ORDER_DATA]: {
    type: FETCH_MANUAL_FAULT_ORDER_DATA,
    workorderTypeString: '38'//人工填报故障工单
  },
  [FETCH_SCADA_FAULT_ORDER_DATA]: {
    type: FETCH_SCADA_FAULT_ORDER_DATA,
    workorderTypeString: '37'//风云系统生成的故障工单
  }
}
