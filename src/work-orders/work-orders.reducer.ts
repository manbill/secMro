import { WorkOrder } from "./work-order.modal";
export interface WorkOrderEntities{
  [id:number]:WorkOrder;
}
export interface WorkOrdersState{
  workOrderIds:number[],
  entities:WorkOrderEntities;
}
