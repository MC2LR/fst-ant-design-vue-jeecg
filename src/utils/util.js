import * as api from '@/api/api'
import { isURL } from '@/utils/validate'
export function timeFix() {
 
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? i18n.t('morning') : (hour <= 12 ?  i18n.t('morning') : (hour <= 13 ?  i18n.t('afternoon') : (hour < 20 ?  i18n.t('afternoon') :  i18n.t('evening'))))
    
 
}

export function welcome() {
  const arr = ['少し休みましょう', '何を食べる予定ですか?', 'DOTAを打ちましょうか', 'あなたは疲れているかもしれない']
  let index = Math.floor((Math.random()*arr.length))
  return arr[index]
}

/**
 * 触発する window.resize
 */
export function triggerWindowResizeEvent() {
  let event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * フィルタオブジェクトには空の属性が入る
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return;
  }

  for ( var key in obj) {
    if (obj.hasOwnProperty(key)
      && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key];
    }
  }
  return obj;
}

/**
 * 時間フォーマット
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt) {
  var regPos = /^\d+(\.\d+)?$/;
  if(regPos.test(value)){
    //数字ならば
    let getDate = new Date(value);
    let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      'S': getDate.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt;
  }else{
    //TODO
    value = value.trim();
    return value.substr(0,fmt.length);
  }
}

// トップページルーティングの生成
export function generateIndexRouter(data) {
let indexRouter = [{
          path: '/',
          name: 'dashboard',
          //component: () => import('@/components/layouts/BasicLayout'),
          component: resolve => require(['@/components/layouts/TabLayout'], resolve),
          meta: { title: 'ホームページ' },
          redirect: '/dashboard/analysis',
          children: [
            ...generateChildRouters(data)
          ]
        },{
          "path": "*", "redirect": "/404", "hidden": true
        }]
  return indexRouter;
}

// 生成入れ子ルーティング(子ルーティング)

function  generateChildRouters (data) {
  const routers = [];
  for (var item of data) {
    let component = "";
    if(item.component.indexOf("layouts")>=0){
       component = "components/"+item.component;
    }else{
       component = "views/"+item.component;
    }

    // eslint-disable-next-line
    let URL = (item.meta.url|| '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URLは{{window.xxx}の占位子変数をサポートする
    if (isURL(URL)) {
      item.meta.url = URL;
    }

    let menu =  {
      path: item.path,
      name: item.name,
      redirect:item.redirect,
      component: resolve => require(['@/' + component+'.vue'], resolve),
      hidden:item.hidden,
      //component:()=> import(`@/views/${item.component}.vue`),
      meta: {
        title:item.meta.title ,
        icon: item.meta.icon,
        url:item.meta.url ,
        permissionList:item.meta.permissionList,
        keepAlive:item.meta.keepAlive,
        /*update_begin author:wuxianquan date:20190908 for:値を賦与する */
        internalOrExternal:item.meta.internalOrExternal
        /*update_end author:wuxianquan date:20190908 for:値を賦与する */
      }
    }
    if(item.alwaysShow){
      menu.alwaysShow = true;
      menu.redirect = menu.path;
    }
    if (item.children && item.children.length > 0) {
      menu.children = [...generateChildRouters( item.children)];
    }
    //--update-begin----author:scott---date:20190320------for:バックグラウンドメニュー構成によって、メニューフィールドをルーティングするかどうかを判断し、ルーティングを生成するかを動的に選択する（パラメータURLメニューをサポートするため））------
    //判断是否生成路由
    if(item.route && item.route === '0'){
      //console.log(' 不生成路由 item.route：  '+item.route);
      //console.log(' 不生成路由 item.path：  '+item.path);
    }else{
      routers.push(menu);
    }
    //--update-end----author:scott---date:20190320------for:バックグラウンドメニュー構成によって、メニューフィールドをルーティングするかどうかを判断し、ルーティングを生成するかを動的に選択する（パラメータURLメニューをサポートするため）------
  }
  return routers
}

/**
 * ディープクローンオブジェクト、配列
 * @param obj クローンされたオブジェクト
 * @return クローン後のオブジェクト
 */
export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 乱数生成
 *
 * 例:長さ12の乱数を生成:randomNumber(12)
 * 例:3~23の間の乱数生成:randomNumber(3, 23)
 *
 * @param1 最小値|长
 * @param2 最大値
 * @return int 生成後の数字
 */
export function randomNumber() {
  // 最小値から最大値までの区間の乱数を生成します
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  if (arguments.length === 1) {
    let [length] = arguments
  // 指定された長さのランダムな数字を生成します。トップは必ず0ではありません
    let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
    return parseInt(nums.join(''))
  } else if (arguments.length >= 2) {
    let [min, max] = arguments
    return random(min, max)
  } else {
    return Number.NaN
  }
}

/**
 * ランダムに文字列を生成する
 * @param length 文字列の長さ
 * @param chats 任意の文字列区間(入力文字列中の文字だけが生成される)
 * @return string 生成された文字列
 */
export function randomString(length, chats) {
  if (!length) length = 1
  if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
  let str = ''
  for (let i = 0; i < length; i++) {
    let num = randomNumber(0, chats.length - 1)
    str += chats[num]
  }
  return str
}

/**
 * ランダムに生成するuuid
 * @return string 生成したuuid
 */
export function randomUUID() {
  let chats = '0123456789abcdef'
  return randomString(32, chats)
}

/**
 * アンダーラインがヘメルに移る
 * @param string
 * @returns {*}
 */
export function underLine2CamelCase(string){
  return string.replace( /_([a-z])/g, function( all, letter ) {
    return letter.toUpperCase();
  });
}

/**
 * 取扱ボタンが表示されているかを判断する
 * @param bpmStatus
 * @returns {*}
 */
export function showDealBtn(bpmStatus){
  if(bpmStatus!="1"&&bpmStatus!="3"&&bpmStatus!="4"){
    return true;
  }
  return false;
}

/**
 * CSSを強化し,ページ上でグローバルCSSを出力できるようにした
 * @param css 強化するcss
 * @param id styleタグのidは、古いスタイルをクリアするために使用できます
 */
export function cssExpand(css, id) {
  let style = document.createElement('style')
  style.type = "text/css"
  style.innerHTML = `@charset "UTF-8"; ${css}`
  // 古いスタイルをクリア
  if (id) {
    let $style = document.getElementById(id)
    if ($style != null) $style.outerHTML = ''
    style.id = id
  }
  // 新しいスタイルを適用
  document.head.appendChild(style)
}

/**
 * 繰り返し値検証ツール方法
 *
 * 使用例:
 * { validator: (rule, value, callback) => validateDuplicateValue('sys_fill_rule', 'rule_code', value, this.model.id, callback) }
 *
 * @param tableName 検証された表名
 * @param fieldName 検証されたフィールド名
 * @param fieldVal 検証された値
 * @param dataId データIDは,空である
 * @param callback
 */
export function validateDuplicateValue(tableName, fieldName, fieldVal, dataId, callback) {
  let params = { tableName, fieldName, fieldVal, dataId }
  api.duplicateCheck(params).then(res => {
    res['success'] ? callback() : callback(res['message'])
  }).catch(err => {
    callback(err.message || err)
  })
}