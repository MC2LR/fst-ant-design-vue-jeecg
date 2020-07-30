import { USER_AUTH,SYS_BUTTON_AUTH } from "@/store/mutation-types"

const hasPermission = {
    install (Vue, options) {
        console.log(options);
          Vue.directive('has', {
            inserted: (el, binding, vnode)=>{
                console.log("ページ権限制御----");
                //ノード権限処理は,ヒットした場合はグローバル権限処理を行わない
                if(!filterNodePermission(el, binding, vnode)){
                  filterGlobalPermission(el, binding, vnode);
                }
            }
          });
    }
};

/**
 * 大域的権限制御
 */
export function filterNodePermission(el, binding, vnode) {
  console.log("ページ権限——NODE——");

  var permissionList = [];
  try {
    var obj = vnode.context.$props.formData;
    if (obj) {
      let bpmList = obj.permissionList;
      for (var bpm of bpmList) {
        if(bpm.type != '2') {
          permissionList.push(bpm);
        }
      }
    }
  } catch (e) {
    //console.log("ページ権限異常——", e);
  }
  if (permissionList === null || permissionList === "" || permissionList === undefined||permissionList.length<=0) {
    //el.parentNode.removeChild(el)
    return false;
  }
  let permissions = [];
  for (var item of permissionList) {
    if(item.type != '2') {
      permissions.push(item.action);
    }
  }
  //console.log("ページ権限——"+permissions);
  //console.log("ページ権限——"+binding.value);
  if (!permissions.includes(binding.value)) {
    //el.parentNode.removeChild(el)
    return false;
  }else{
    for (var item2 of permissionList) {
      if(binding.value === item2.action){
        return true;
      }
    }
  }
  return false;
}

/**
 * 大域的権限制御
 */
export function filterGlobalPermission(el, binding, vnode) {
  console.log("ページ権限——Global——");

  var permissionList = [];
  var allPermissionList = [];

  //let authList = Vue.ls.get(USER_AUTH);
  let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]");
  for (var auth of authList) {
    if(auth.type != '2') {
      permissionList.push(auth);
    }
  }
  //console.log("ページ権限——Global——",sessionStorage.getItem(SYS_BUTTON_AUTH));
  let allAuthList = JSON.parse(sessionStorage.getItem(SYS_BUTTON_AUTH) || "[]");
  for (var gauth of allAuthList) {
    if(gauth.type != '2') {
      allPermissionList.push(gauth);
    }
  }
  //全体配置がヒットするかどうかを設定する
  var invalidFlag = false;//無効ヒット
  if(allPermissionList != null && allPermissionList != "" && allPermissionList != undefined && allPermissionList.length > 0){
    for (var itemG of allPermissionList) {
      if(binding.value === itemG.action){
        if(itemG.status == '0'){
          invalidFlag = true;
          break;
        }
      }
    }
  }
  if(invalidFlag){
    return;
  }
  if (permissionList === null || permissionList === "" || permissionList === undefined||permissionList.length<=0) {
    el.parentNode.removeChild(el);
    return;
  }
  let permissions = [];
  for (var item of permissionList) {
    if(item.type != '2'){
      permissions.push(item.action);
    }
  }
  if (!permissions.includes(binding.value)) {
    el.parentNode.removeChild(el);
  }
}

export default hasPermission;
