interface SqlVersion {
  sqlVersion: number,
  sqlStatements: string[]
}
export const tableNames={
  eam_sql_version:'eam_sql_version',
  eam_user:'eam_user',
  eam_sync_function:'eam_sync_function',
  eam_sync_file:'eam_sync_file',
  eam_sync_work_order:'eam_sync_work_order',
  eam_sync_dictionary_detail:'eam_sync_dictionary_detail'
}

export const SqlVersions: SqlVersion[] = [
  {
    sqlVersion: 1,
    sqlStatements: [
      `create table if not exists ${tableNames.eam_sql_version} (sqlVersion number)`,
      `create table if not exists ${tableNames.eam_user} (
        userJson text ,
        selectedCompanyJson text,
        selectedProjectJson text,
        lastLoginTime number
      )`,
      `create table if not exists ${tableNames.eam_sync_function} (
        syncFunctionName text,
        lastSyncSuccessTime number,
        syncStatus text
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
        activeFlag text,
        createBy int,
        createOn int,
        lastUpdBy int,
        lastUpdOn text,
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
  }
]
