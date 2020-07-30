import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import {Modal, notification} from 'ant-design-vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"

// axiosインスタンスを作成する
const service = axios.create({
  baseURL: '/jeecg-boot', // api base_url
  timeout: 60000 // タイムアウト時間の要求
})

const err = (error) => {
  if (error.response) {
    let data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    console.log("------異常応答------",token)
    console.log("------異常応答------",error.response.status)
    switch (error.response.status) {
      case 403:
        notification.error({ message: 'しすてむぷろんぷと', description: '訪問を拒否する',duration: 4})
        break
      case 500:
        // notification.error({ message: 'しすてむぷろんぷと', description:'Token失効のため、再登録してください!',duration: 4})
        if(token && data.message=="Token失効のため、再登録してください"){
          // update-begin- --- author:scott ------ date:20190225 ---- for:Token失効は弾枠モードを採用し、直接ジャンプしない----
          // store.dispatch('Logout').then(() => {
          //     window.location.reload()
          // })
          // Modal.error({
          //   title: '登録が切れた',
          //   content: '申し訳ありませんが、登録期限が切れていますので、再登録してください',
          //   okText: '再登録',
          //   mask: false,
          //   onOk: () => {
          //     store.dispatch('Logout').then(() => {
                Vue.ls.remove(ACCESS_TOKEN)
                window.location.reload()
          //     })
          //   }
          // })
          // update-end- --- author:scott ------ date:20190225 ---- for:Token失効は弾枠モードを採用し、直接ジャンプしない----
        }
        break
      case 404:
          notification.error({ message: 'システムのヒント', description:'申し訳ありませんが、資源が見つかりません!',duration: 4})
        break
      case 504:
        notification.error({ message: 'システムのヒント', description: 'ネットワークタイムアウト'})
        break
      case 401:
        notification.error({ message: 'システムのヒント', description:'許可されていないので、再登録してください',duration: 4})
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        notification.error({
          message: 'システムのヒント',
          description: data.message,
          duration: 4
        })
        break
    }
  }
  return Promise.reject(error)
};

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers[ 'X-Access-Token' ] = token // 各要求にカスタマイズtokenを携帯させます。実際の状況に応じて自分で修正してください。 
  }             
  if(config.method=='get'){
    if(config.url.indexOf("sys/dict/getDictItems")<0){
      config.params = {
        _t: Date.parse(new Date())/1000,
        ...config.params
      }
    }
  }
  return config
},(error) => {
  return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((response) => {
    return response.data
  }, err)

const installer = {
  vm: {},
  install (Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}