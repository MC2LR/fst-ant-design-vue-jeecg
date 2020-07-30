import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { generateIndexRouter } from "@/utils/util"

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/user/login', '/user/register', '/user/register-result','/user/alteration'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar

  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: '/dashboard/workplace' })
      NProgress.done()
    } else {
      if (store.getters.permissionList.length === 0) {
        store.dispatch('GetPermissionList').then(res => {
              const menuData = res.result.menu;
              console.log(res.message)
              if (menuData === null || menuData === "" || menuData === undefined) {
                return;
              }
              let constRoutes = [];
              constRoutes = generateIndexRouter(menuData);
              // メインインターフェイスルートを追加する
              store.dispatch('UpdateAppRouter',  { constRoutes }).then(() => {
                // ロールの許可に基づいてアクセス可能なルーティングテーブルを生成する
                // アクセス可能なルーティングテーブルを動的に追加する
                router.addRoutes(store.getters.addRouters)
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                if (to.path === redirect) {
                  // メソッドをハックしてaddRoutesが完了していることを確認する ,set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true })
                } else {
                  // 目的地へのジャンプ
                  next({ path: redirect })
                }
              })
            })
          .catch(() => {
           /* notification.error({
              message: 'システムプロンプト',
              description: 'ユーザー情報のリクエストに失敗しました。もう一度お試しください！'
            })*/
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // ログイン不要のホワイトリストに、直接入力してください
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
