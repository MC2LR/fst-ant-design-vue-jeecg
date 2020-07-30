import JEditableTable from '@/components/jeecg/JEditableTable'
import { VALIDATE_NO_PASSED, getRefPromise, validateFormAndTables } from '@/utils/JEditableTableUtil'
import { httpAction, getAction } from '@/api/manage'

export const JEditableTableMixin = {
  components: {
    JEditableTable
  },
  data() {
    return {
      title: '操作する',
      visible: false,
      form: this.$form.createForm(this),
      confirmLoading: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    }
  },
  methods: {

    /** すべてのeditableのインスタンスを取得します。 */
    getAllTable() {
      if (!(this.refKeys instanceof Array)) {
        throw this.throwNotArray('refKeys')
      }
      let values = this.refKeys.map(key => getRefPromise(this, key))
      return Promise.all(values)
    },

    /** すべてのJEditablebleの例を巡回します */
    eachAllTable(callback) {
      // 遍歴を始める
      this.getAllTable().then(tables => {
        tables.forEach((item, index) => {
          if (typeof callback === 'function') {
            callback(item, index)
          }
        })
      })
    },

    /** 追加ボタンをクリックするとこの方法が呼び出される */
    add() {
      if (typeof this.addBefore === 'function') this.addBefore()
      // デフォルトで空データが追加される
      let rowNum = this.addDefaultRowNum
      if (typeof rowNum !== 'number') {
        rowNum = 1
        console.warn('dataには、addDefaultRowNumやaddDefaultRowNumは数字ではないと定義されていないので、デフォルトで空データを追加します。空データを追加したくない場合は、addDefaultRowNumを0としてください')
      }
      this.eachAllTable((item) => {
        item.add(rowNum)
      })
      if (typeof this.addAfter === 'function') this.addAfter(this.model)
      this.edit({})
    },
    /** 編集(修正)ボタンをクリックするとこの方法が呼び出される */
    edit(record) {
      if (typeof this.editBefore === 'function') this.editBefore(record)
      this.visible = true
      this.activeKey = this.refKeys[0]
      this.form.resetFields()
      this.model = Object.assign({}, record)
      if (typeof this.editAfter === 'function') this.editAfter(this.model)
    },
    /** 弾倉を閉じ,すべてのJEditableTableインスタンスを初期状態に戻す */
    close() {
      this.visible = false
      this.eachAllTable((item) => {
        item.initialize()
      })
      this.$emit('close')
    },

    /** あるtabのデータを調べる */
    requestSubTableData(url, params, tab) {
      tab.loading = true
      getAction(url, params).then(res => {
        tab.dataSource = res.result || []
      }).finally(() => {
        tab.loading = false
      })
    },
    /** 新規または修正作業を実行するかどうかを,依頼を開始し,自動的に判断する */
    request(formData) {
      let url = this.url.add, method = 'post'
      if (this.model.id) {
        url = this.url.edit
        method = 'put'
      }
      this.confirmLoading = true
      httpAction(url, formData, method).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('ok')
          this.close()
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.confirmLoading = false
      })
    },

    /* --- handle できごと --- */

    /** ATab オプションカード切替イベント */
    handleChangeTabs(key) {
      // scrollTop状態を自動的にリセットし、ホワイトスクリーンの出現を防ぐ
      getRefPromise(this, key).then(editableTable => {
        editableTable.resetScrollTop()
      })
    },
    /** [オピニオン]ボタンクリックイベント */
    handleCancel() {
      this.close()
    },
    /** ボタンクリックイベントを確定する */
    handleOk() {
      /** トリガー・フォーム検証 */
      this.getAllTable().then(tables => {
        /** メインテーブルとすべてのサブテーブルを一括して検証する */
        return validateFormAndTables(this.form, tables)
      }).then(allValues => {
        if (typeof this.classifyIntoFormData !== 'function') {
          throw this.throwNotFunction('classifyIntoFormData')
        }
        let formData = this.classifyIntoFormData(allValues)
        // 請求をする
        return this.request(formData)
      }).catch(e => {
        if (e.error === VALIDATE_NO_PASSED) {
          // フォーム検証を通過していないサブテーブルがあれば,それが存在するtabに自動的にジャンプする
          this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
        } else {
          console.error(e)
        }
      })
    },

    /* --- throw --- */

    /** not a function */
    throwNotFunction(name) {
      return `${name} 関数は定義されていない`
    },

    /** not a array */
    throwNotArray(name) {
      return `${name} 配列は定義されていない`
    }

  }
}