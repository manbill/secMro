interface SqlVersion {
  sqlVersion: number,
  sqlStatements: string[]
}
export const tableNames={
  eam_sql_version:'eam_sql_version',
  eam_user:'eam_user',
  eam_sync_actions:'eam_sync_actions',
  eam_sync_file:'eam_sync_file',
  eam_sync_work_order:'eam_sync_work_order',
  eam_sync_dictionary_detail:'eam_sync_dictionary_detail',
  eam_sync_material:'eam_sync_material'
}

export const SqlVersions: SqlVersion[] = [
  {
    sqlVersion: 1,
    sqlStatements: [
      `create table if not exists ${tableNames.eam_sql_version} (sqlVersion number)`,
      `create table if not exists ${tableNames.eam_user} (
        userStateJson text,
        userId int not null,
        primary key(userId)
      )`,
      //syncStatus 0代表失败，1代表成功
      `create table if not exists ${tableNames.eam_sync_actions} (
        syncAction text,
        lastSyncSuccessTime number,
        syncStatus number
      )`
    ]
  },
  {
    sqlVersion:2,
    sqlStatements:[
      `create table if not exists ${tableNames.eam_sync_dictionary_detail}(
        detailId int not null,
        detailName text,
        dictionaryId int ,
        paraType text,
        detailCode text,
        detailComment text,
        activeFlag number,
        createBy int,
        createOn int,
        lastUpdBy int,
        lastUpdOn int,
        PRIMARY KEY(detailId)
      )`
    ]
  },
  {
    sqlVersion:3,
    sqlStatements:[
      `create table if not exists ${tableNames.eam_sync_work_order}(
        activeFlag text,
        areaType text,
        areaTypeName text,
        assignPerson text,
        faultBegindate int,
        faultCode text,
        faultName text,
        lastUpdateDatetimeApi int,
        createOn int,
        planBegindate int,
        planEnddate int,
        planNoticeId int,
        positionCode text,
        positionId  int,
        projectId int,
        projectName text,
        siteManager text,
        taskAccepted text,
        transNoticeNo text,
        workTypeId int,
        workTypeName text,
        workorderCode text,
        workorderId int not null,
        workorderStatus int,
        workorderStatusName text,
        uploadStatus int,
        downloadStatus int,
        workorderTitle text,
        workorderType int,
        workorderTypeName text,
        json text,
        PRIMARY KEY(workorderId)
      )`
    ]
  },
  {
    sqlVersion:4,
    sqlStatements:[
      `create table if not exists ${tableNames.eam_sync_material}(
        materialId int not null,
        materialName text,
        unit text,
        materialSno text,
        materialType text,
        materialTypeText text,
        materialSuite text,
        machine_model text,
        materialFileid int,
        materialValue text,
        marterialExpiredate int,
        materialComment text,
        materialSupplier text,
        materialFilePath text,
        qrcodeFileid int,
        materialQrFilePath text,
        material_replace text,
        comment text,
        materialVendor text,
        machineModel text,
        machineModelId int,
        materialReplace text,
        activeFlag int,
        sapInventoryFlag int,
        json text,
        primary key(materialId)
      )
      `
    ]
  }
]
