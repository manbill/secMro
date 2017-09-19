export class FanMachine {
  aogAcceptanceDate: string;// null
  areaCode: string;//"1"
  areaName: string;//"华东区"
  comment: string;//null
  createBy: string;//null
  createOn: string;// "2017-02-25"
  currPage: number;//0
  eTypeName: string;//null
  endDate: string;//null
  equipmentCoding: string;// null
  equipmentId: string;// null
  equipmentLevel: string;// null
  equipmentMemo: string;//null
  equipmentName: string;// null
  equipmentPositionCoding: string;// null
  guaranteePeriod: string;// null
  id: number;// 2307
  isFlg: string;// null
  lastUpdBy: string;// null
  lastUpdateDatetimeApi: string;// null
  machineId: string;// "TEMPID2307"
  machineModelId: string;// null
  machineModelName: string;// null
  machineTypeId: string;//null
  machineTypeName: string;// null
  materialId: string;// null
  materialNo: string;// null
  pageSize: number;// 0
  parentId: string;// null
  positionCode: string;// "1"
  positionId: string;// 2307
  productionDate: string;// null
  projectId: number;// 848
  projectName: string;// "上海电力崇明北沿"
  qiVendorShortname: string; //null
  seriesNo: string;// null
  softwareVersion: string;// null
  startDate: string;// null
  status: number;//2
  statusName: string;// "已提交"
  submitDate: string;// "2017-02-25"
  templateCoding: string;//  "W2000"
  templateName: string;// "2MW通用型模版"
  umaterialNo: string;//null
  userName: string;// null
  useriesNo: string;// null
  uvendorShortname: string;// null
  variationDate: string;// "2017-08-21"
  variationDateEnd: string;// null
  variationDateStart: string;// null
  vendorShortname: string;// null
  warrantySupplierBegindate: string;// null
  workOrderCode: string;// null
  workTypeId: string;// null
  workorderType: string;// null
  worktitle: string;// null
}
export class DeviceTree {
  childDeviceTrees: DeviceTree[];
  equipmentId: number;// 741330;
  equipmentName: string;//"机舱";
  machineId: string;
  parentId: number;// 0;
}
export class FanMachineEquipmentDetails {
  deviceTree: DeviceTree;
  equipmentId2EquipmentDetails: {
    [equipmentId: number]: FanMachine;
  };
  id: number;// 2307
  machineDTO: FanMachine;
  machineId: string;// "TEMPID2307"
}
