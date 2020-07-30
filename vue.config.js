const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463
   */
  // 実稼働環境にソースマップが必要ない場合は、falseに設定して、実稼働環境のビルドを高速化できます。
  productionSourceMap: false,

  //アプリがパッケージ化されたら、この構成を手放します
  //publicPath:'./',
  configureWebpack: config => {
    //本番環境はキャンセルされました console.log
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
      .set('@mobile', resolve('src/modules/mobile'))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less カスタムantデザインテーマの変数オーバーライド */

          /*
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
          */
        },
        javascriptEnabled: true,
      }
    }
  },

  devServer: {
    port: 3000,
    proxy: {
     /* '/api': {
        target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro', //mock APIインターフェースシステム
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '/jeecg-boot': ''  //デフォルトでは、すべての要求の先頭にjeecg-bootが付いていますが、これは削除する必要があります。
        }
      },*/
      '/jeecg-boot': {
        target: 'http://localhost:8080', //ローカルニーズjeecg-bootバックグラウンドプロジェクトのリクエスト
        ws: false,
        changeOrigin: true
      },
    }
  },

  lintOnSave: undefined
}