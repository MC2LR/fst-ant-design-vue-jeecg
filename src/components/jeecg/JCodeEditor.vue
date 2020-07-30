<template>
  <div v-bind="fullScreenParentProps">
    <a-icon v-if="fullScreen" class="full-screen-icon" type="fullscreen" @click="()=>fullCoder=!fullCoder"/>

    <div class="code-editor-cust full-screen-child">
      <textarea ref="textarea"></textarea>
      <span @click="nullTipClick" class="null-tip" :class="{'null-tip-hidden':hasCode}" :style="nullTipStyle">{{ placeholderShow }}</span>
      <template v-if="languageChange">
        <a-select v-model="mode" size="small" class="code-mode-select" @change="changeMode" placeholder="テーマを選択してください">
          <a-select-option
            v-for="mode in modes"
            :key="mode.value"
            :value="mode.value">
            {{ mode.label }}
          </a-select-option>
        </a-select>
      </template>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // グローバルインスタンスの紹介
  import _CodeMirror from 'codemirror'

  // コアスタイル
  import 'codemirror/lib/codemirror.css'
  // テーマが導入された後、テーマを有効にするにはオプションで指定する必要があります darcula  gruvbox-dark hopscotch  monokai
  import 'codemirror/theme/panda-syntax.css'
  //ヒントcss
  import "codemirror/addon/hint/show-hint.css";

  // 特定の構文強調表示ライブラリを導入して、対応する構文強調表示効果を持たせる必要があります。
  // codemirror /addon/mode/loadmode.jsおよび/mode/meta.jsを介して、対応する構文強調ライブラリの動的ロードを公式にサポートします
  // しかし、vueは、インスタンスが初期化された後、対応するJSを動的にロードできないようではないため、対応するJSはここに事前に導入されています
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/mode/css/css.js'
  import 'codemirror/mode/xml/xml.js'
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/mode/markdown/markdown.js'
  import 'codemirror/mode/python/python.js'
  import 'codemirror/mode/r/r.js'
  import 'codemirror/mode/shell/shell.js'
  import 'codemirror/mode/sql/sql.js'
  import 'codemirror/mode/swift/swift.js'
  import 'codemirror/mode/vue/vue.js'

  // グローバルインスタンスを取得しよう
  const CodeMirror = window.CodeMirror || _CodeMirror

  export default {
    name: 'JCodeEditor',
    props: {
      // 双方向バインディングの外部着信コンテンツ
      value: {
        type: String,
        default: ''
      },
      // 外部で渡される構文タイプ
      language: {
        type: String,
        default: null
      },
     languageChange:{
       type: Boolean,
       default:false,
       required:false
     },
      placeholder: {
        type: String,
        default: null
      },
      // 行番号を表示
      lineNumbers: {
        type: Boolean,
        default: true
      },
      // 全画面ボタンを表示するかどうか
      fullScreen: {
        type: Boolean,
        default: false
      },
      // 全画面表示後z-index
      zIndex: {
        type: [Number, String],
        default: 999
      }
    },
    data () {
      return {
        // 真のコンテンツの中
        code: '',
        hasCode:false,
        // デフォルトの構文タイプ
        mode: 'javascript',
        // エディターインスタンス
        coder: null,
        // デフォルト設定
        options: {
          // インデント形式
          tabSize: 2,
          // テーマ、対応するテーマライブラリJSは事前に導入する必要があります
          theme: 'panda-syntax',
          line: true,
         // extraKeys: {'Ctrl': 'autocomplete'},//カスタムショートカット
          hintOptions: {
            tables: {
              users: ['name', 'score', 'birthDate'],
              countries: ['name', 'population', 'size']
            }
          },
        },
        // 切り替えの構文強調表示をサポートし、対応するJSが事前に導入されています
        // MIME-TYPEが使用されますが、後で指定された場合、接頭辞としてtext /が書き込まれます。
        modes: [{
          value: 'css',
          label: 'CSS'
        }, {
          value: 'javascript',
          label: 'Javascript'
        }, {
          value: 'html',
          label: 'XML/HTML'
        }, {
          value: 'x-java',
          label: 'Java'
        }, {
          value: 'x-objectivec',
          label: 'Objective-C'
        }, {
          value: 'x-python',
          label: 'Python'
        }, {
          value: 'x-rsrc',
          label: 'R'
        }, {
          value: 'x-sh',
          label: 'Shell'
        }, {
          value: 'x-sql',
          label: 'SQL'
        }, {
          value: 'x-swift',
          label: 'Swift'
        }, {
          value: 'x-vue',
          label: 'Vue'
        }, {
          value: 'markdown',
          label: 'Markdown'
        }],
        // code エディターが全画面かどうか
        fullCoder: false
      }
    },
    watch: {
      // value: {
      //   immediate: false,
      //   handler(value) {
      //     this._getCoder().then(() => {
      //       this.coder.setValue(value)
      //     })
      //   }
      // },
      language: {
        immediate: true,
        handler(language) {
          this._getCoder().then(() => {
            //親コンテナから構文タイプを取得してください
            if (language) {
              // 特定の構文タイプオブジェクトを取得する
              let modeObj = this._getLanguage(language)

              // 親コンテナから渡された構文がサポートされているかどうかを判断します
              if (modeObj) {
                this.mode = modeObj.label
                this.coder.setOption('mode', `text/${modeObj.value}`)
              }
            }
          })
        }
      }
    },
    computed: {
      placeholderShow() {
        if (this.placeholder == null) {
          return `ここに$ {this.language}コードを入力してください`
        } else {
          return this.placeholder
        }
      },
      nullTipStyle(){
        if (this.lineNumbers) {
          return { left: '36px' }
        } else {
          return { left: '12px' }
        }
      },
      // coder 構成
      coderOptions() {
        return {
          tabSize: this.options.tabSize,
          theme: this.options.theme,
          lineNumbers: this.lineNumbers,
          line: true,
          hintOptions: this.options.hintOptions
        }
      },
      fullScreenParentProps(){
        let props = {
          class: ['full-screen-parent', this.fullCoder ? 'full-screen' : ''],
          style: {}
        }
        if (this.fullCoder) {
          props.style['z-index'] = this.zIndex
        }
        return props
      }
    },
    mounted () {
      // 初期化
      this._initialize()
    },
    methods: {
      // 初期化
      _initialize () {
        // エディターインスタンスを初期化し、インスタンス化するテキストフィールドオブジェクトとデフォルトの構成を渡します
        this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.coderOptions)
        // エディターの割り当て
        if(this.value||this.code){
          this.hasCode=true
          this.coder.setValue(this.value || this.code)
        }else{
          this.coder.setValue('')
          this.hasCode=false
        }
        // 双方向バインディングをサポート
        this.coder.on('change', (coder) => {
          this.code = coder.getValue()
          if(this.code){
            this.hasCode=true
          }else{
            this.hasCode=false
          }
          if (this.$emit) {
            this.$emit('input', this.code)
          }
        })
        this.coder.on('focus', () => {
          this.hasCode=true
        })
        this.coder.on('blur', () => {
          if(this.code){
            this.hasCode=true
          }else{
            this.hasCode=false
          }
        })

       /* this.coder.on('cursorActivity',()=>{
          this.coder.showHint()
        })*/

      },
      getCodeContent(){
        return this.code
      },
      setCodeContent(val){
        setTimeout(()=>{
          if(!val){
            this.coder.setValue('')
          }else{
            this.coder.setValue(val)
          }
        },300)
      },
      // 現在の構文タイプを取得します
      _getLanguage (language) {
        // サポートされている構文タイプのリストで着信構文タイプを探します
        return this.modes.find((mode) => {
          // すべての値は大文字と小文字を区別せずに簡単に比較できます
          let currentLanguage = language.toLowerCase()
          let currentLabel = mode.label.toLowerCase()
          let currentValue = mode.value.toLowerCase()

          // 実際の値は非標準である可能性があるため、たとえばjavaの実際の値はx-javaであるため、値とラベルは同時に渡された構文と比較されます
          return currentLabel === currentLanguage || currentValue === currentLanguage
        })
      },
      _getCoder() {
        let _this = this
        return new Promise((resolve) => {
          (function get() {
            if (_this.coder) {
              resolve(_this.coder)
            } else {
              setTimeout(get, 10)
            }
          })()
        })
      },
      // 変更モード
      changeMode (val) {
        // エディター構文構成の変更
        this.coder.setOption('mode', `text/${val}`)

        // 変更された構文を取得する
        let label = this._getLanguage(val).label.toLowerCase()

        // 次の関数を使用して、親コンテナーが現在の構文値をリッスンできるようにします
        this.$emit('language-change', label)
      },
      nullTipClick(){
        this.coder.focus()
      }
    }
  }
</script>

<style lang="less">
  .code-editor-cust{
    flex-grow:1;
    display:flex;
    position:relative;
    height:100%;
    .CodeMirror{
      flex-grow:1;
      z-index:1;
      .CodeMirror-code{
        line-height:19px;
      }

    }
    .code-mode-select{
      position:absolute;
      z-index:2;
      right:10px;
      top:10px;
      max-width:130px;
    }
    .CodeMirror{
      height: auto;
      min-height:100%;
    }
    .null-tip{
      position: absolute;
      top: 4px;
      left: 36px;
      z-index: 10;
      color: #ffffffc9;
      line-height: initial;
    }
    .null-tip-hidden{
      display: none;
    }
  }

  /* 全画面スタイル */
  .full-screen-parent {
    position: relative;

    .full-screen-icon {
      opacity: 0;
      color: black;
      width: 20px;
      height: 20px;
      line-height: 24px;
      background-color: white;
      position: absolute;
      top: 2px;
      right: 2px;
      z-index: 9;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    &:hover {
      .full-screen-icon {
        opacity: 1;

        &:hover {
          background-color: rgba(255, 255, 255, 0.88);
        }
      }
    }

    &.full-screen {
      position: fixed;
      top: 10px;
      left: 10px;
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      padding: 10px;
      background-color: #f5f5f5;

      .full-screen-icon {
        top: 12px;
        right: 12px;
      }
      .full-screen-child {
        height: 100%;
        max-height: 100%;
        min-height: 100%;
      }
    }

    .full-screen-child {
      min-height: 120px;
      max-height: 320px;
    }

  }

.CodeMirror-cursor{
  height:18.4px !important;
}
</style>