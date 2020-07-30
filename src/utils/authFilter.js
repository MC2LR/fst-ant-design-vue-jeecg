
import { USER_AUTH,SYS_BUTTON_AUTH } from "@/store/mutation-types"

export function disabledAuthFilter(code,formData) {
  if(nodeDisabledAuth(code,formData)){
    return true;
  }else{
    return globalDisabledAuth(code);
  }
}

function nodeDisabledAuth(code,formData){
  console.log("ページ権限の無効化--NODE--始まる");
  var permissionList = [];
  try {
    var obj = formData;
    //console.log("ページ権限を無効にする——NODE——開始",obj);
    if (obj) {
      let bpmList = obj.permissionList;
      for (var bpm of bpmList) {
        if(bpm.type == '2') {
          permissionList.push(bpm);
        }
      }
    }
  } catch (e) {
    //console.log("ページ権限異常----", e);
  }
  if (permissionList === null || permissionList === "" || permissionList === undefined||permissionList.length<=0) {
    return false;
  }
  let permissions = [];
  for (var item of permissionList) {
    if(item.type == '2') {
      permissions.push(item.action);
    }
  }
  //console.log("ページ権限----"+code);
  if (!permissions.includes(code)) {
    return false;
  }else{
    for (var item2 of permissionList) {
      if(code === item2.action){
        console.log("NODE——ページ権限を無効にする");
        return true;
      }
    }
  }
  return false;
}

function globalDisabledAuth(code){
  console.log("ページの無効化権限——Global——開始");

  var permissionList = [];
  var allPermissionList = [];

  //let authList = Vue.ls.get(USER_AUTH);
  let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]");
  for (var auth of authList) {
    if(auth.type == '2') {
      permissionList.push(auth);
    }
  }
  //console.log("ページの無効化権限——Global——",sessionStorage.getItem(SYS_BUTTON_AUTH));
  let allAuthList = JSON.parse(sessionStorage.getItem(SYS_BUTTON_AUTH) || "[]");
  for (var gauth of allAuthList) {
    if(gauth.type == '2') {
      allPermissionList.push(gauth);
    }
  }
  //全体配置がヒットするかどうかを設定する
  var  gFlag = false;//命中を無効にする
  var invalidFlag = false;//無効ヒット
  if(allPermissionList != null && allPermissionList != "" && allPermissionList != undefined && allPermissionList.length > 0){
    for (var itemG of allPermissionList) {
      if(code === itemG.action){
        if(itemG.status == '0'){
          invalidFlag = true;
          break;
        }else{
          gFlag = true;
          break;
        }
      }
    }
  }
  if(invalidFlag){
    return false;
  }
  if (permissionList === null || permissionList === "" || permissionList === undefined||permissionList.length<=0) {
    return gFlag;
  }
  let permissions = [];
  for (var item of permissionList) {
    if(item.type == '2') {
      permissions.push(item.action);
    }
  }
  //console.log("ページの無効化権限——"+code);
  if (!permissions.includes(code)) {
    return gFlag;
  }else{
    for (var item2 of permissionList) {
      if(code === item2.action){
        console.log("ページ権限解除の禁止——Global——発効");
        gFlag = false;
      }
    }
    return gFlag;
  }
}



export function colAuthFilter(columns,pre) {
  var authList = getNoAuthCols(pre);
  const cols = columns.filter(item => {
    if (hasColoum(item,authList)) {
      return true
    }
    return false
  })
  return cols
}

function hasColoum(item,authList){
  if (authList.includes(item.dataIndex)) {
    return false
  }
  return true
}

//権限が無効のときは制御をしない,有効のときは制御をしない,表示しないことしか制御できない
//許可コードプレフィックスに従って許可されていない列の情報を取得する
function getNoAuthCols(pre){
  var permissionList = [];
  var allPermissionList = [];

  //let authList = Vue.ls.get(USER_AUTH);
  let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]");
  for (var auth of authList) {
    //政策,有効状態を示す
    if(auth.type == '1'&&startWith(auth.action,pre)) {
      permissionList.push(substrPre(auth.action,pre));
    }
  }
  //console.log("ページの無効化権限——Global——",sessionStorage.getItem(SYS_BUTTON_AUTH));
  let allAuthList = JSON.parse(sessionStorage.getItem(SYS_BUTTON_AUTH) || "[]");
  for (var gauth of allAuthList) {
    //政策,有効状態を示す
    if(gauth.type == '1'&&gauth.status == '1'&&startWith(gauth.action,pre)) {
      allPermissionList.push(substrPre(gauth.action,pre));
    }
  }
  const cols = allPermissionList.filter(item => {
    if (permissionList.includes(item)) {
      return false;
    }
    return true;
  })
  return cols;
}

function startWith(str,pre) {
  if (pre == null || pre == "" || str==null|| str==""|| str.length == 0 || pre.length > str.length)
    return false;
  if (str.substr(0, pre.length) == pre)
    return true;
  else
    return false;
}

function substrPre(str,pre) {
  return str.substr(pre.length);
}