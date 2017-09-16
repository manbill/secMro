export class ManualInstructor {
  "manualInfoDTO": {
    "manualId": number,
    "fileId": number,
    "detailId": null,
    "worktypeId": number,
    "workPhase": string,
    "machineModel": any,
    "fileName": string,
    "actualFileName": string,
    "fileType": string,
    "workType": string,
    "filePath": string,
    "importDate": string,
    "checklistFileId": number,
    "businessType": number,
    "businessNo": string,
    "businessName": string,
    "pageNum": number,
    "machineModelId": number,
    "userversionNo": string,
    "versionNo": number,
    "status": number,
    "statusName": string,
    "manualName": string,
    "userId": number,
    "ifImprove": number,
    "parentManualId": number,
    "parentManualName": string
  };
  "manualCataContnList": manualCataContent[];
}

interface manualCataContent {
  "manualId": number,
  "manualdetail_id": number,
  "manualdetail_parentid": number,
  "manual_catalog": string,
  "manual_content": string;
  "userId": number,
  "fileList": any[],
  "fileIds": number[]
}
