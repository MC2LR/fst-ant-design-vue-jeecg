/**
 * 辞書 util
 * author: scott
 * date: 20190109
 */

import {ajaxGetDictItems} from '@/api/api'
import {getAction} from '@/api/manage'

/**
 * 辞書配列を取得する
 * @param dictCode 辞書Code
 * @return List<Map>
 */
export async function initDictOptions(dictCode) {
  if (!dictCode) {
    return '辞書コードを空にすることはできません！';
  }
  //辞書配列を取得する
  let res = await ajaxGetDictItems(dictCode);
  return res;
}

/**
 * 辞書値置換テキストの一般的な方法
 * @param dictOptions  辞書配列
 * @param text  辞書の値
 * @return String
 */
export function filterDictText(dictOptions, text) {
  //--update-begin----author:sunjianlei---date:20191025------for:辞書がロードされない前に辞書置換メソッドがエラーを報告する問題、および辞書が見つからないときにnull値を返す問題を修正---
  if (dictOptions instanceof Array) {
    for (let dictItem of dictOptions) {
      if (text === dictItem.value) {
        return dictItem.text
      }
    }
  }
  return text
//--update-end----author:sunjianlei---date:20191025------for:辞書がロードされない前に辞書置換メソッドがエラーを報告する問題、および辞書が見つからないときにnull値を返す問題を修正---
}

/**
 * 辞書値置換テキストの一般的な方法（複数選択）
 * @param dictOptions  辞書配列
 * @param text  辞書の値
 * @return String
 */
export function filterMultiDictText(dictOptions, text) {
  if(!text || !dictOptions || dictOptions.length==0){
    return ""
  }
  let re = "";
  let arr = text.split(",")
  dictOptions.forEach(function (option) {
    for(let i=0;i<arr.length;i++){
      if (arr[i] === option.value) {
        re += option.text+",";
        break;
      }
    }
  });
  if(re==""){
    return text;
  }
  return re.substring(0,re.length-1);
}

/**
 * フィールド値に対応するテキストを翻訳する
 * @param children
 * @returns string
 */
export async function ajaxFilterDictText(dictCode, key) {
  if (!dictCode) {
    return '辞書コードを空にすることはできません！';
  }
  //console.log(`key : ${key}`);
  if (!key) {
    return '';
  }
  //リクエストにより辞書のテキストを読む
  let res = await getAction(`/sys/dict/getDictText/${dictCode}/${key}`);
  if (res.success) {
    // console.log('restult: '+ res.result);
    return res.result;
  } else {
    return '';
  }
}