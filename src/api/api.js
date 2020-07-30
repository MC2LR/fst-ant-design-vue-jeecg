import { getAction,deleteAction,putAction,postAction} from '@/api/manage'

////ルートパス
// const doMian = "/jeecg-boot/";
////画像プレビューリクエストアドレス
// const imgView = "http://localhost:8080/jeecg-boot/sys/common/view/";

//ロール管理
const addRole = (params)=>postAction("/sys/role/add",params);
const editRole = (params)=>putAction("/sys/role/edit",params);
// const getRoleList = (params)=>getAction("/sys/role/list",params);
// const deleteRole = (params)=>deleteAction("/sys/role/delete",params);
// const deleteRoleList = (params)=>deleteAction("/sys/role/deleteBatch",params);
const checkRoleCode = (params)=>getAction("/sys/role/checkRoleCode",params);
const queryall = (params)=>getAction("/sys/role/queryall",params);

//ユーザー管理
const addUser = (params)=>postAction("/sys/user/add",params);
const editUser = (params)=>putAction("/sys/user/edit",params);
const queryUserRole = (params)=>getAction("/sys/user/queryUserRole",params);
const queryUserBusiness = (params)=>getAction("/sys/user/queryUserBusiness",params);
const queryUserWindows = (params)=>getAction("/sys/user/queryUserWindows",params);
const queryUserBank = (params)=>getAction("/sys/user/queryUserBank",params);
const getUserList = (params)=>getAction("/sys/user/list",params);
// const deleteUser = (params)=>deleteAction("/sys/user/delete",params);
// const deleteUserList = (params)=>deleteAction("/sys/user/deleteBatch",params);
const frozenBatch = (params)=>putAction("/sys/user/frozenBatch",params);
//ユーザーが存在することを確認します
const checkOnlyUser = (params)=>getAction("/sys/user/checkOnlyUser",params);
//パスワードを変更する
const changPassword = (params)=>putAction("/sys/user/changPassword",params);

//権限管理
const addPermission= (params)=>postAction("/sys/permission/add",params);
const editPermission= (params)=>putAction("/sys/permission/edit",params);
const getPermissionList = (params)=>getAction("/sys/permission/list",params);
/*update_begin author:wuxianquan date:20190908 for:クエリの第1レベルメニューとサブメニュークエリAPIを追加します */
const getSystemMenuList = (params)=>getAction("/sys/permission/getSystemMenuList",params);
const getSystemSubmenu = (params)=>getAction("/sys/permission/getSystemSubmenu",params);
/*update_end author:wuxianquan date:20190908 for:クエリの第1レベルメニューとサブメニュークエリAPIを追加します */

// const deletePermission = (params)=>deleteAction("/sys/permission/delete",params);
// const deletePermissionList = (params)=>deleteAction("/sys/permission/deleteBatch",params);
const queryTreeList = (params)=>getAction("/sys/permission/queryTreeList",params);
const queryTreeListForRole = (params)=>getAction("/sys/role/queryTreeList",params);
const queryListAsync = (params)=>getAction("/sys/permission/queryListAsync",params);
const queryRolePermission = (params)=>getAction("/sys/permission/queryRolePermission",params);
const saveRolePermission = (params)=>postAction("/sys/permission/saveRolePermission",params);
//const queryPermissionsByUser = (params)=>getAction("/sys/permission/queryByUser",params);
const queryPermissionsByUser = (params)=>getAction("/sys/permission/getUserPermissionByToken",params);
const loadAllRoleIds = (params)=>getAction("/sys/permission/loadAllRoleIds",params);
const getPermissionRuleList = (params)=>getAction("/sys/permission/getPermRuleListByPermId",params);
const queryPermissionRule = (params)=>getAction("/sys/permission/queryPermissionRule",params);

// 部門管理
const queryDepartTreeList = (params)=>getAction("/sys/sysDepart/queryTreeList",params);
const queryIdTree = (params)=>getAction("/sys/sysDepart/queryIdTree",params);
const queryParentName   = (params)=>getAction("/sys/sysDepart/queryParentName",params);
const searchByKeywords   = (params)=>getAction("/sys/sysDepart/searchBy",params);
const deleteByDepartId   = (params)=>deleteAction("/sys/sysDepart/delete",params);

//ログ管理
//const getLogList = (params)=>getAction("/sys/log/list",params);
const deleteLog = (params)=>deleteAction("/sys/log/delete",params);
const deleteLogList = (params)=>deleteAction("/sys/log/deleteBatch",params);

//データ辞書
const addDict = (params)=>postAction("/sys/dict/add",params);
const editDict = (params)=>putAction("/sys/dict/edit",params);
//const getDictList = (params)=>getAction("/sys/dict/list",params);
const treeList = (params)=>getAction("/sys/dict/treeList",params);
// const delDict = (params)=>deleteAction("/sys/dict/delete",params);
//const getDictItemList = (params)=>getAction("/sys/dictItem/list",params);
const addDictItem = (params)=>postAction("/sys/dictItem/add",params);
const editDictItem = (params)=>putAction("/sys/dictItem/edit",params);
//const delDictItem = (params)=>deleteAction("/sys/dictItem/delete",params);
//const delDictItemList = (params)=>deleteAction("/sys/dictItem/deleteBatch",params);

//辞書タグ専用（コードで辞書配列を取得）
export const ajaxGetDictItems = (code, params)=>getAction(`/sys/dict/getDictItems/${code}`,params);

//システム発表
const doReleaseData = (params)=>getAction("/sys/annountCement/doReleaseData",params);
const doReovkeData = (params)=>getAction("/sys/annountCement/doReovkeData",params);
//システムトラフィックを取得する
const getLoginfo = (params)=>getAction("/sys/loginfo",params);
const getVisitInfo = (params)=>getAction("/sys/visitInfo",params);
//データログアクセス
// const getDataLogList = (params)=>getAction("/sys/dataLog/list",params);

// 部門の主キーに基づいてユーザー情報を照会する
const queryUserByDepId = (params)=>getAction("/sys/user/queryUserByDepId",params);

// ユーザー役割テーブルのすべての情報を照会する
const queryUserRoleMap = (params)=>getAction("/sys/user/queryUserRoleMap",params);
// 重複チェック
const duplicateCheck = (params)=>getAction("/sys/duplicate/check",params);

const CheckTemCode=    (params)=>getAction("/terminal/terminalInfo/queryByCode",params);
// 分類辞書を読み込む
const loadCategoryData = (params)=>getAction("/sys/category/loadAllData",params);


const queryBankIdTree = (params)=>getAction("/test/bank/querySelectList",params);
const queryOrgSelectList = (params)=>getAction("/test/bank/queryOrgSelectList",params);
const queryBankTreeList = (params)=>getAction("/test/bank/queryTreeList",params);

export {
  // imgView,
  // doMian,
  addRole,
  editRole,
  checkRoleCode,
  addUser,
  editUser,
  queryUserRole,
  queryUserBusiness,
  queryUserWindows , 
  queryUserBank,
  getUserList,
  queryall,
  frozenBatch,
  checkOnlyUser,
  changPassword,
  getPermissionList,
  addPermission,
  editPermission,
  queryTreeList,
  queryListAsync,
  queryRolePermission,
  saveRolePermission,
  queryPermissionsByUser,
  loadAllRoleIds,
  getPermissionRuleList,
  queryPermissionRule,
  queryDepartTreeList,
  queryIdTree,
  queryParentName,
  searchByKeywords,
  deleteByDepartId,
  deleteLog,
  deleteLogList,
  addDict,
  editDict,
  treeList,
  addDictItem,
  editDictItem,
  doReleaseData,
  doReovkeData,
  getLoginfo,
  getVisitInfo,
  queryUserByDepId,
  queryUserRoleMap,
  duplicateCheck,
  queryTreeListForRole,
  getSystemMenuList,
  getSystemSubmenu,
  loadCategoryData,
  queryBankIdTree,
  queryOrgSelectList,
  queryBankTreeList,
  CheckTemCode
}



