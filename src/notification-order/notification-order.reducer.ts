import { NotificationOrder } from "./notification-order.modal";
interface NotificationEntities {
  [id: number]: NotificationOrder

}
export interface NotificationOrdersState {
  ids: number[],
  notificationEntities: NotificationEntities
}
