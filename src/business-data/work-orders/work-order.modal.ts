import { ManualInstructor } from './../../base-data/manual-instructor/instructor.modal';
export interface BaseOrderList {
  hasMoreData?: boolean;
  refreshCompleted?: boolean;
  loadMoreDataCompleted?: boolean;
}
export  class WorkOrder {
  apiWorkorderBaseInfoDto: ApiWorkorderBaseInfoDto;
  workorderDetails: WorkorderDetails;
  materialStandarList: MaterialStandarDto;
  repairRecordList: RepairRecord;
  workorderChecks: WorkorderCheck[];
  workorderManuals: ManualInstructor[];
}
export class WorkorderCheck {
  checkFileDto: CheckFileDto;
  eaWoCheckListCatDtoList: EaWoCheckListCatDto[];
  eaWoManualDTO: EaWoManualDTO;
}
export class EaWoManualDTO {
  businessType: number
  createBy: number
  createOn: number
  currPage: number
  fileId: number
  fileName: string;
  fileType: string;
  isSelect: number
  iseSelectName: string;
  lastUpdBy: string;
  lastUpdOn: string;
  manualId: number
  manualName: string;
  mastermanualId: string;
  pageSize: number
  woManualId: number
  workorderId: number
}
export class EaWoCheckListCatDto {
  checklistCat: string;
  eaWoCheckListDtoList: EaWoCheckListDto[];
}
export class EaWoFilemappingDto {
  workorderId: number;
  source: number;
  fileId: number;
  filemappingId: number;//null;
  remark: string;//null;
  activeFlag: number;
  filePath: string;
  fileActualName: string;
  fileOriginalName: string;
  fileType: string;
  fileSize: number;
  flag: number;
  createBy: string;
  createOn: string;
  createByName: string;
}
export class EaWoCheckListDto {
  checklistCat: string;
  checklistId: number;
  checklistType: number;
  checklistUserInput: string;
  checklistValue: string;
  comment: string;
  createBy: string;
  createOn: string;
  currPage: string;
  eaWoFilemappingDtoList: EaWoFilemappingDto[];
  isUploadPic: number;
  item: string;
  lastUpdBy: string;
  lastUpdOn: string;
  remark: string;
  seriesNum: string;
  woManualId: number;
}
export class CheckFileDto {
  actualFileName: string;
  createBy: string;
  createOn: string;
  fileId: number;
  fileMappingId: number;//null
  fileNameType: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  flag: string;
  originalFileName: string;
  workOrderId: string;
}
export class RepairRecord {
  workorderFixInfoDtoList: WorkorderFixInfoDto[]
}
export class WorkorderFixInfoDto {
  /*     String      */
  workorderId: string;//工单id
  /*    Integer     */
  repairId: number;//维修记录id
  /*Integer*/
  fixType: number;//维修类型
  /*String*/
  fixTypeText: string;//维修类型名称
  /*Integer*/
  deviceId: number;//部件id
  /*String*/
  deviceName: string;//部件名称
  /*String*/
  serialNumnumber1: string;//更换前部件序列号
  /*String*/
  serialNumnumber2: string;//更换后部件序列号
  /*String*/
  wuliaohaonumber1: string;//更换前物料号
  /*String*/
  wuliaohaonumber2: string;//更换好物料号
  /*String*/
  providernumber1: string;//更换前供应商
  /*String*/
  providernumber2: string;//更换前供应商
  /*String*/
  fixBeginDatenumber1: string;//更换前质保期开始时间
  /*String*/
  fixBeginDatenumber2: string;//更换前质保期结束时间
  /*String*/
  fixEndDatenumber1: string;//更换后质保期开始时间
  /*String*/
  fixEndDatenumber2: string;//更换后质保期结束时间
  /*Integer*/
  guaranteePeriodnumber1: number;//更换前质保期
  /*Integer*/
  guaranteePeriodnumber2: number;//更换后质保期
  /*String*/
  functionCode: string;//功能号
  /*String*/
  remark: string;//描述
  /*String*/
  originalMaterialSno: string;//原始的物料号
  /*String*/
  updateMaterialSno: string;//更改后的物料号
  /*Integer*/
  activeFlag: number;//有效标志
  /*String*/
  createBy: string;//创建人
  /* String */
  createOn: string;//创建时间
  // List < RepairMaterialDto >
  repairMaterialDtoList: RepairMaterialDto[];//消耗物料列表

}
export class RepairMaterialDto {
  /*Integer*/
  repairMaterialId: number;//维修消耗物料id
  /*Integer*/
  repairId: number;//维修记录id
  /*Integer*/
  materialId: number;//物料id
  /*String*/
  materialName: string;//物料名称
  /*String*/
  materialSno: string;//物料编号
  /*Double*/
  amount: number;//消耗数量
  /*String*/
  unitDes: string;//物料单位名称
  /*Integer*/
  unit: number;//物料单位
  /*String*/
  workorderCode: string;//工单编号
  /*String*/
  repertoryNo: string;//库存地点
  /*String*/
  mbnumberbDocNum: string;//货物移库凭证号
  /*String*/
  mbnumberbDocYear: string;//货物移库凭证年度
  /*String*/
  mbstDocNum: string;//冲销凭证号
  /*String*/
  mbstDocYear: string;//冲销凭证年度
  /*String*/
  wbsNum: string;//WBS编号
  /*Integer*/
  sapInventoryFlag: number;//账内库存标识 number：是；number：否；
  /*Integer*/
  activeFlag: number;//有效标识 number：有效；number无效；
  /*String*/
  positionCode: string;//机位号
  /*String*/
  positionTurbine: null;//机位序列号
  /*Integer*/
  createBy: number;//创建用户
  /*String*/
  createOn: string;//创建时间
  /*Integer*/
  lastUpdBy: number;//最后修改人
  /*String*/
  lastUpdOn: string;//最后修改时间
}
export class MaterialStandarDto {
  eaWoMaterialDemandDtoList: EaWoMaterialDemandDto[];
}
export class EaWoMaterialDemandDto {
  activeFlag: number;
  actualNum: number;
  comment: string;
  createBy: string;
  createOn: string;
  currPage: number;
  demandId: number;
  fileId: number;
  lastUpdBy: string;
  lastUpdOn: string;
  materialId: number;
  materialName: string;//"齿轮油过滤器滤芯_MEHnumberRNTFnumberN/Mnumber_敏泰"
  materialSno: string;//"Bnumber"
  mbnumberbDocNum: number;//null
  mbnumberbDocYear: string;//null
  mbstDocNum: number;//null
  mbstDocYear: string;//null
  positionCode: number;// null
  positionTurbine: string;//null
  referNum: number;
  repertoryNo: string;//
  sapInventoryFlag: number;
  unitName: string;//"EA"
  wbsNum: string;//null
  workorderCode: string;// null
  workorderId: number;// null
}
export class WorkorderDetails {
  eaWoWorkorderinfoDto: EaWoWorkorderinfoDto;
  eaWoWorkorderAuditingDtoList: EaWoWorkorderAuditingDto[];
  eaWoPauseDtoList: EaWoPauseDto[];
  eaWoFilemappingList: EaWoFilemappingDto[];
  eaWoFaultInfoDtoList: EaWoFaultInfoDto[];
}
export class EaWoPauseDto {
  activeFlag: number;
  createBy: number
  createOn: string;
  pauseId: number
  pauseRemark: string;
  pausereasonId: string;
  pausereasonName: string;
  status: number
  statusName: string;
  workorderId: number
}
export class EaWoFaultInfoDto {

}
export class EaWoWorkorderAuditingDto {
  activeFlag: number;
  auditingDate: string;
  auditingId: string;
  auditingOpinion: string;
  auditingResult: string;
  auditingUser: string;
  auditiogResultName: string;
  workorderId: number;
}
export class EaWoWorkorderinfoDto {
  workorderId: number;
  workorderCode: string;
  workorderTitle: string;
  workorderType: string;
  workorderTypeName: string;
  faultSource: string;
  areaType: string;
  areaTypeName: string;
  siteManager: string;
  workTypeId: string;
  workTypeName: string;
  transNoticeId: number;
  transNoticeNo: string;
  planBegindate: string;
  planEnddate: string;
  planId: number;
  planDetailId: number;
  planNoticeId: number;
  assignPerson: number;
  projectId: number;
  projectName: string;
  deviceSno: string;
  positionId: number;
  positionCode: number;
  deviceId: number;
  deviceName: string;
  faultCode: string;
  faultName: string;
  faultBegindate: string;
  faultEnddate: string;
  faultHandleDesc: string;
  workorderStatus: number;
  workorderStatusName: string;//处理中;
  dealBegindate: string;// ;
  dealEnddate: string;//;
  workTotalHour: string;//;
  ncrTrigger: string;// ;
  ncrNum: string;//;
  otherFactorType: string;// ;
  otherShutdownHour: string;//;
  shutdownTotalHour: string;//;
  otherFactorComment: string;//;
  faultAdvice: string;//;
  faultDetailComment: string;//;
  faultReason: string;// ;
  faultReasonName: string;//null;
  faultReasonComment: string;//;
  attributeGroupid: number;
  remark: string;//sdfdsf;
  activeFlag: number;// number;
  createBy: string;// null;
  createOn: string;//number-number-number number:number:number;
  lastUpdBy: string;//null;
  lastUpdOn: string;//number/number/number number:number;
  attrKeyArr: string[];
  attrValArr: string[];
  filemappingIdArr: number[];
  fileIdArr: number[];
  planBegindateFromDate: string;//null;
  planBegindateToDate: string;//null;
  planEnddateFromDate: string;// null;
  planEnddateToDate: string;//null;
  faultBegindateFromDate: string;//null;
  faultBegindateToDate: string;//null;
  faultEnddateFromDate: string;//null;
  faultEnddateToDate: string;//null;
  currPage: string;//null;
  pageSize: string;//null;
  workorderTypeDetailName: string;// null;
  pauseTotalHour: string;// null;
  pausereasonCause: string;//null;
  funFlg: string;//null;
  materialId: string;//null;
  totaldw: string;// null;
  machineId: string;//null
}
export class ApiWorkorderBaseInfoDto {
  activeFlag: number;
  areaType: string;
  areaTypeName: string;//西南区
  assignPerson: string;//number
  assignPersonName: string;// 陈成
  faultBegindate: string;
  faultCode: string;
  faultName: string;
  lastUpdateDatetimeApi: number
  planBegindate: string;//number/number/number
  planEnddate: string;//number/number/number
  planNoticeId: string;//number
  positionCode: string;//number
  positionId: string;//number
  projectId: string;//number
  projectName: string;// 中广核云南华宁磨豆山
  siteManager: string;// number
  taskAccepted: boolean;
  transNoticeNo: string;
  workTypeId: string;//number
  workTypeName: string;//全年维护
  workorderCode: string;//DWnumber
  workorderId: number;// number
  workorderStatus: string;//number
  workorderStatusName: string;//确认完工
  workorderTitle: string;
  workorderType: string;//number
  workorderTypeName: string;//定期维护
}
