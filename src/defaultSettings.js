/**
 * プロジェクトのデフォルト構成アイテム
 * primaryColor - デフォルトのテーマの色
 * navTheme - sidebar theme ['dark', 'light'] 2つのテーマ
 * colorWeak - カラーブラインドモード
 * layout - 全体のレイアウト ['sidemenu', 'topmenu'] 2つのレイアウト
 * fixedHeader - 修正済み Header : boolean
 * fixSiderbar - 左メニューバーを修正 ： boolean
 * autoHideHeader - 下にスクロールすると非表示 Header : boolean
 * contentWidth - コンテンツ領域のレイアウト：ストリーミング|修正済み
 *
 * storageOptions: {} - Vue-ls プラグイン構成アイテム (localStorage/sessionStorage)
 *
 */

export default {
  primaryColor: '#1890FF', // primary color of ant design
  navTheme: 'light', // theme for nav menu
  layout: 'sidemenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fixed', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: false, // sticky header
  fixSiderbar: false, // sticky siderbar
  autoHideHeader: false, //  auto hide header
  colorWeak: false,
  multipage: false, //デフォルトでマルチタブモード
  // vue-ls options
  storageOptions: {
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local', // storage name session, local, memory
  }
}