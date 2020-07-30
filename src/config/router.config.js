import { UserLayout, TabLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'

/**
 * メニューを歩き,権限制御をする
 * @type {[null,null]}
 */
export const asyncRouterMap = [

  {
    path: '/',
    name: 'dashboard',
    component: TabLayout,
    meta: { title: 'ホームページ' },
    redirect: '/dashboard/workplace',
    children: [

      // // dashboard
      // {
      //   path: '/dashboard',
      //   name: 'dashboard',
      //   redirect: '/dashboard/workplace',
      //   component: RouteView,
      //   meta: { title: 'パネル盤', icon: 'dashboard', permission: [ 'dashboard' ] },
      //   children: [
      //     {
      //       path: '/dashboard/analysis',
      //       name: 'Analysis',
      //       component: () => import('@/views/dashboard/Analysis'),
      //       meta: { title: '解析ページ', permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/dashboard/monitor',
      //       name: 'Monitor',
      //       hidden: true,
      //       component: () => import('@/views/dashboard/Monitor'),
      //       meta: { title: '監視ページ', permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/dashboard/workplace',
      //       name: 'Workplace',
      //       component: () => import('@/views/dashboard/Workplace'),
      //       meta: { title: 'しけんようてーぶる', permission: [ 'dashboard' ] }
      //     }
      //   ]
      // },
      //
      // // forms
      // {
      //   path: '/form',
      //   redirect: '/form/basic-form',
      //   component: PageView,
      //   meta: { title: 'フォームページ', icon: 'form', permission: [ 'form' ] },
      //   children: [
      //     {
      //       path: '/form/base-form',
      //       name: 'BaseForm',
      //       component: () => import('@/views/form/BasicForm'),
      //       meta: { title: 'ベース・フォーム', permission: [ 'form' ] }
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'StepForm',
      //       component: () => import('@/views/form/stepForm/StepForm'),
      //       meta: { title: 'ステップ・フォーム', permission: [ 'form' ] }
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'AdvanceForm',
      //       component: () => import('@/views/form/advancedForm/AdvancedForm'),
      //       meta: { title: '高級フォーム', permission: [ 'form' ] }
      //     }
      //   ]
      // },
      //
      // // list
      // {
      //   path: '/list',
      //   name: 'list',
      //   component: PageView,
      //   redirect: '/list/query-list',
      //   meta: { title: 'リストページ', icon: 'table', permission: [ 'table' ] },
      //   children: [
      //     {
      //       path: '/list/query-list',
      //       name: 'QueryList',
      //       component: () => import('@/views/list/TableList'),
      //       meta: { title: 'チェックリスト', permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/edit-table',
      //       name: 'EditList',
      //       component: () => import('@/views/list/TableInnerEditList'),
      //       meta: { title: '編集表', permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/user-list',
      //       name: 'UserList',
      //       component: () => import('@/views/list/UserList'),
      //       meta: { title: 'ユーザーリスト', permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/role-list',
      //       name: 'RoleList',
      //       component: () => import('@/views/list/RoleList'),
      //       meta: { title: '登場人物', permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/permission-list',
      //       name: 'PermissionList',
      //       component: () => import('@/views/list/PermissionList'),
      //       meta: { title: '典拠カード', permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'BasicList',
      //       component: () => import('@/views/list/StandardList'),
      //       meta: { title: '標準リスト', permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/card',
      //       name: 'CardList',
      //       component: () => import('@/views/list/CardList'),
      //       meta: { title: 'カード一覧', permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'SearchList',
      //       component: () => import('@/views/list/search/SearchLayout'),
      //       redirect: '/list/search/article',
      //       meta: { title: '検索リス', permission: [ 'table' ] },
      //       children: [
      //         {
      //           path: '/list/search/article',
      //           name: 'SearchArticles',
      //           component: () => import('../views/list/TableList'),
      //           meta: { title: '検索リスト(記事)', permission: [ 'table' ] }
      //         },
      //         {
      //           path: '/list/search/project',
      //           name: 'SearchProjects',
      //           component: () => import('../views/list/TableList'),
      //           meta: { title: 'リスト(項目)を検索する', permission: [ 'table' ] }
      //         },
      //         {
      //           path: '/list/search/application',
      //           name: 'SearchApplications',
      //           component: () => import('../views/list/TableList'),
      //           meta: { title: '検索リスト(アプリケーション)', permission: [ 'table' ] }
      //         },
      //       ]
      //     },
      //   ]
      // },
      //
      // // profile
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   component: RouteView,
      //   redirect: '/profile/basic',
      //   meta: { title: '詳細ページ', icon: 'profile', permission: [ 'profile' ] },
      //   children: [
      //     {
      //       path: '/profile/basic',
      //       name: 'ProfileBasic',
      //       component: () => import('@/views/profile/basic/Index'),
      //       meta: { title: '基本ページ', permission: [ 'profile' ] }
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'ProfileAdvanced',
      //       component: () => import('@/views/profile/advanced/Advanced'),
      //       meta: { title: '詳細ページ', permission: [ 'profile' ] }
      //     }
      //   ]
      // },
      //
      // // result
      // {
      //   path: '/result',
      //   name: 'result',
      //   component: PageView,
      //   redirect: '/result/success',
      //   meta: { title: '結果ページ', icon: 'check-circle-o', permission: [ 'result' ] },
      //   children: [
      //     {
      //       path: '/result/success',
      //       name: 'ResultSuccess',
      //       component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
      //       meta: { title: '成功する。', hiddenHeaderContent: true, permission: [ 'result' ] }
      //     },
      //     {
      //       path: '/result/fail',
      //       name: 'ResultFail',
      //       component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
      //       meta: { title: '失敗する', hiddenHeaderContent: true, permission: [ 'result' ] }
      //     }
      //   ]
      // },
      //
      // // Exception
      // {
      //   path: '/exception',
      //   name: 'exception',
      //   component: RouteView,
      //   redirect: '/exception/403',
      //   meta: { title: '異常ページ', icon: 'warning', permission: [ 'exception' ] },
      //   children: [
      //     {
      //       path: '/exception/403',
      //       name: 'Exception403',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
      //       meta: { title: '403', permission: [ 'exception' ] }
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'Exception404',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
      //       meta: { title: '404', permission: [ 'exception' ] }
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'Exception500',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
      //       meta: { title: '500', permission: [ 'exception' ] }
      //     }
      //   ]
      // },
      //
      // // account
      // {
      //   path: '/account',
      //   component: RouteView,
      //   name: 'account',
      //   meta: { title: '個人ページ', icon: 'user', keepAlive: true, permission: [ 'user' ] },
      //   children: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: () => import('@/views/account/center/Index'),
      //       meta: { title: 'パーソナルセンター', keepAlive: true, permission: [ 'user' ] }
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: () => import('@/views/account/settings/Index'),
      //       meta: { title: '個人設定', hideHeader: true, keepAlive: true, permission: [ 'user' ]  },
      //       redirect: '/account/settings/base',
      //       alwaysShow: true,
      //       children: [
      //         {
      //           path: '/account/settings/base',
      //           name: 'BaseSettings',
      //           component: () => import('@/views/account/settings/BaseSetting'),
      //           meta: { title: 'いちじこうせい', hidden: true, keepAlive: true, permission: [ 'user' ]  }
      //         },
      //         {
      //           path: '/account/settings/security',
      //           name: 'SecuritySettings',
      //           component: () => import('@/views/account/settings/Security'),
      //           meta: { title: '安全設定', hidden: true, keepAlive: true, permission: [ 'user' ]  }
      //         },
      //         {
      //           path: '/account/settings/custom',
      //           name: 'CustomSettings',
      //           component: () => import('@/views/account/settings/Custom'),
      //           meta: { title: 'カスタマイズ設定', hidden: true, keepAlive: true, permission: [ 'user' ]  }
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           name: 'BindingSettings',
      //           component: () => import('@/views/account/settings/Binding'),
      //           meta: { title: 'アカウントバインディング', hidden: true, keepAlive: true, permission: [ 'user' ]  }
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           name: 'NotificationSettings',
      //           component: () => import('@/views/account/settings/Notification'),
      //           meta: { title: '新しいニュース通知', hidden: true, keepAlive: true, permission: [ 'user' ]  }
      //         },
      //       ]
      //     },
      //   ]
      // }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * ベースルーティング
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'alteration',
        name: 'alteration',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Alteration')
      },
    ]
  },

  // {
  //   path: '/',
  //   name: 'index',
  //   component: TabLayout,
  //   meta: {title: 'ホームページ'},
  //   redirect: '/dashboard/workplace',
  //   children: [
  //     {
  //       path: '/online',
  //       name: 'online',
  //       redirect: '/online',
  //       component: RouteView,
  //       meta: {title: 'オンライン開発', icon: 'dashboard', permission: ['dashboard']},
  //       children: [
  //         {
  //           path: '/online/auto/:code',
  //           name: 'report',
  //           component: () => import('@/views/modules/online/cgreport/OnlCgreportAutoList')
  //         },
  //       ]
  //     },
  //   ]
  // },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },

]
