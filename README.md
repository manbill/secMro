# Sec Mro App
## 使用ionic2重构sec mro app
### 启动app 流程
#### App启动后，检查是否已经跟踪了数据库脚本版本，如果没有，说明是第一次安装，首先需要执行所有的数据库脚本版本；如果已经跟踪版本，首先检查是否需要更新版本，如有更新，首先执行更新，而且需要清空所有缓存数据，然后初始化需要同步的基础数据的记录，将他们的状态记录是未完成，时间设定为0（或者2000年）；如果脚本没有更新，需要检查是否app版本升级，如果有，需要清空缓存数据，并标记基础数据尚未下载完成，需要用户重新登录，然后下载基础数据。
### 启动App,首先从缓存中获取用户状态userState、baseDataState，然后初始化应用的userState,baseDataState，如果数据库中该状态尚未存在，或者是baseDataState尚未完成，需要用户都必须重新登录，如果尚未选择过项目，则需要重新选择项目，然后开始下载基础数据和业务数据，同时跳转到tabs首页，如果下载过程中断并且基础数据尚未下载完成，需要跳转回登录界面，重新开始下载数据。借助angular的FormGroup来辅助判断基础数据都下载完成
##### login->loginSuccess->fetchProjects->fetcProjectsFullfiled->fetchCompanies->fetchCompaniesCompleted->selectProject->tabsPage,同时downloadData(baseData,businessData)，如果中断下载，判断baseDataState，如果有一个不成功，立即跳转登录界面，重新登录下载数据。
#### 如果用户登录成功，检查用户换了账号，需要跳转到选择项目界面，重新选择项目，清空缓存的业务数据，然后重新下载业务数据.
