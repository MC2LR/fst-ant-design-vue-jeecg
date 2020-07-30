<template>
  <a-modal
    title="高度なクエリビルダー"
    :width="1000"
    :visible="visible"
    @cancel="handleCancel"
    :mask="false"
    wrapClassName="ant-modal-cust-warp"
    class="j-super-query-modal"
    style="top:5%;max-height: 95%;">

    <template slot="footer">
      <div style="float: left">
        <a-button :loading="loading" @click="handleReset">リセット</a-button>
        <a-button :loading="loading" @click="handleSave">クエリを保存</a-button>
      </div>
      <a-button :loading="loading" @click="handleCancel">閉じる</a-button>
      <a-button :loading="loading" type="primary" @click="handleOk">検索</a-button>
    </template>

    <a-spin :spinning="loading">
      <a-row>
        <a-col :sm="24" :md="24-5">

          <a-empty v-if="queryParamsModel.length === 0">
            <div slot="description">
              <span>クエリ条件なし</span>
              <a-divider type="vertical"/>
              <a @click="handleAdd">クリックして追加</a>
            </div>
          </a-empty>

          <a-form v-else layout="inline">

            <a-form-item label="フィルター一致" style="margin-bottom: 12px;">
              <a-select v-model="selectValue">
                <a-select-option value="and">AND（すべての条件が一致する必要があります）</a-select-option>
                <a-select-option value="or">OR（いずれかの条件が一致）</a-select-option>
              </a-select>
            </a-form-item>

            <a-row type="flex" style="margin-bottom:10px" :gutter="16" v-for="(item, index) in queryParamsModel" :key="index">

              <a-col :span="8">
                <a-select placeholder="クエリフィールドを選択" v-model="item.field" @select="(val,option)=>handleSelected(option,item)">
                  <a-select-option v-for="(f,fIndex) in fieldList" :key=" 'field'+fIndex" :value="f.value" :data-idx="fIndex">{{ f.text }}</a-select-option>
                </a-select>
              </a-col>

              <a-col :span="4">
                <a-select placeholder="一致ルール" v-model="item.rule">
                  <a-select-option value="eq">等しい</a-select-option>
                  <a-select-option value="ne">等しくない</a-select-option>
                  <a-select-option value="gt">より大きい</a-select-option>
                  <a-select-option value="ge">より大きいか等しい</a-select-option>
                  <a-select-option value="lt">より小さい</a-select-option>
                  <a-select-option value="le">より小さいか等しい</a-select-option>
                  <a-select-option value="right_like">で始まる</a-select-option>
                  <a-select-option value="left_like">次で終わる：</a-select-option>
                  <a-select-option value="like">含む</a-select-option>
                  <a-select-option value="in">で</a-select-option>
                </a-select>
              </a-col>

              <a-col :span="8">
                <template v-if="item.dictCode">
                  <template v-if="item.type === 'table-dict'">
                    <j-popup
                      v-model="item.val"
                      :code="item.dictTable"
                      :field="item.dictCode"
                      :orgFields="item.dictCode"
                      :destFields="item.dictCode"
                    ></j-popup>
                  </template>
                  <j-dict-select-tag v-else v-model="item.val" :dictCode="item.dictCode" placeholder="選択してください"/>
                </template>
                <j-select-multi-user
                  v-else-if="item.type === 'select-user'"
                  v-model="item.val"
                  :buttons="false"
                  :multiple="false"
                  placeholder="ユーザーを選択してください"
                  :returnKeys="['id', item.customReturnField || 'username']"
                />
                <j-select-depart
                  v-else-if="item.type === 'select-depart'"
                  v-model="item.val"
                  :multi="false"
                  placeholder="部門を選択してください"
                  :customReturnField="item.customReturnField || 'id'"
                />
                <j-date v-else-if=" item.type=='date' " v-model="item.val" placeholder="日付を選択してください" style="width: 100%"></j-date>
                <j-date v-else-if=" item.type=='datetime' " v-model="item.val" placeholder="時間を選択してください" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"></j-date>
                <a-input-number v-else-if=" item.type=='int'||item.type=='number' " style="width: 100%" placeholder="値を入力してください" v-model="item.val"/>
                <a-input v-else v-model="item.val" placeholder="値を入力してください"/>
              </a-col>

              <a-col :span="4">
                <a-button @click="handleAdd" icon="plus"></a-button>&nbsp;
                <a-button @click="handleDel( index )" icon="minus"></a-button>
              </a-col>

            </a-row>

          </a-form>
        </a-col>
        <a-col :sm="24" :md="5">
          <!-- クエリレコード -->

          <a-card class="j-super-query-history-card" :bordered="true">
            <div slot="title">
              保存されたクエリ
            </div>

            <a-empty v-if="treeData.length === 0" class="j-super-query-history-empty" description="保存されたクエリはありません"/>
            <a-tree
              v-else
              class="j-super-query-history-tree"
              showIcon
              :treeData="treeData"
              @select="handleTreeSelect"
              @rightClick="handleTreeRightClick"
            >
            </a-tree>
          </a-card>


        </a-col>
      </a-row>


    </a-spin>

    <a-modal title="保存した名前を入力してください" :visible="prompt.visible" @cancel="prompt.visible=false" @ok="handlePromptOk">
      <a-input v-model="prompt.value"></a-input>
    </a-modal>

  </a-modal>
</template>

<script>
  import * as utils from '@/utils/util'
  import JDate from '@/components/jeecg/JDate.vue'
  import JSelectDepart from '@/components/jeecgbiz/JSelectDepart'
  import JSelectMultiUser from '@/components/jeecgbiz/JSelectMultiUser'

  export default {
    name: 'JSuperQuery',
    components: { JDate, JSelectDepart, JSelectMultiUser },
    props: {
      /*
       fieldList: [{
          value:'',
          text:'',
          type:'',
          dictCode:'' // dictCodeに値がある限り、タイプに関係なく辞書のドロップダウンボックスとして表示されます。
       }]
       type:date datetime int number string
      * */
      fieldList: {
        type: Array,
        required: true
      },
      /*
      * このコールバック関数は、クエリ条件である配列パラメーターを受け取ります
      * */
      callback: {
        type: String,
        required: false,
        default: 'handleSuperQuery'
      },

      // 現在読み込んでいます
      loading: {
        type: Boolean,
        default: false
      },

      // このコードによって区別される、クエリ条件を保持する一意のコード
      saveCode: {
        type: String,
        default: 'testSaveCode'
      }

    },
    data() {
      return {

        prompt: {
          visible: false,
          value: ''
        },

        visible: false,
        queryParamsModel: [{}],
        treeIcon: <a-icon type="file-text"/>,
        treeData: [],
        // クエリ条件のプレフィックス名を保存します
        saveCodeBefore: 'JSuperQuerySaved_',
        selectValue: 'and',
      }
    },
    watch: {
      // saveCodeが変更されたら、保存された条件を再クエリします
      saveCode: {
        immediate: true,
        handler(val) {
          let list = this.$ls.get(this.saveCodeBefore + val)
          if (list instanceof Array) {
            this.treeData = list.map(item => {
              item.icon = this.treeIcon
              return item
            })
          }
        }
      }
    },

    methods: {
      show() {
        if (!this.queryParamsModel || this.queryParamsModel.length == 0) {
          this.queryParamsModel = [{}]
        }
        this.visible = true
      },
      handleOk() {
        console.log('---高度なクエリパラメータ--->', this.queryParamsModel)
        if (!this.isNullArray(this.queryParamsModel)) {
          let event = {
            matchType: this.selectValue,
            params: this.removeEmptyObject(utils.cloneObject(this.queryParamsModel))
          }
          this.$emit(this.callback, event.params, event.matchType)
        } else {
          this.$emit(this.callback)
        }
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleAdd() {
        this.queryParamsModel.push({})
      },
      handleDel(index) {
        this.queryParamsModel.splice(index, 1)
      },
      handleSelected(option, item) {
        let index = option.data.attrs['data-idx']

        let { type, dictCode, dictTable, customReturnField } = this.fieldList[index]
        item['type'] = type
        item['dictCode'] = dictCode
        item['dictTable'] = dictTable
        item['customReturnField'] = customReturnField
        this.$set(item, 'val', '')
      },
      handleReset() {
        this.queryParamsModel = [{}]
        this.$emit(this.callback)
      },
      handleSave() {
        let queryParams = this.removeEmptyObject(utils.cloneObject(this.queryParamsModel))
        if (this.isNullArray(queryParams)) {
          this.$message.warning('ヌル条件は保存できません')
        } else {
          this.prompt.value = ''
          this.prompt.visible = true
        }
      },
      handlePromptOk() {

        let { value } = this.prompt
        // 重複する名前があるかどうかを判断する

        let filterList = this.treeData.filter(i => i.title === value)
        if (filterList.length > 0) {
          this.$confirm({
            content: `${value} は既に存在しますが、上書きされますか？`,
            onOk: () => {
              this.prompt.visible = false
              filterList[0].records = this.removeEmptyObject(utils.cloneObject(this.queryParamsModel))
              this.saveToLocalStore()
              this.$message.success('正常に保存されました')
            }
          })
        } else {
          this.prompt.visible = false
          this.treeData.push({
            title: value,
            icon: this.treeIcon,
            records: this.removeEmptyObject(utils.cloneObject(this.queryParamsModel))
          })
          this.saveToLocalStore()
          this.$message.success('正常に保存されました')
        }


      },
      handleTreeSelect(idx, event) {
        if (event.selectedNodes[0]) {
          this.queryParamsModel = utils.cloneObject(event.selectedNodes[0].data.props.records)
        }
      },
      handleTreeRightClick(args) {
        this.$confirm({
          content: '現在のクエリを削除しますか？',
          onOk: () => {
            let { node: { eventKey } } = args
            this.treeData.splice(Number.parseInt(eventKey.substring(2)), 1)
            this.saveToLocalStore()
            this.$message.success('正常に削除されました')
          },
        })
      },

      // クエリをLocalStoreに保存します
      saveToLocalStore() {
        this.$ls.set(this.saveCodeBefore + this.saveCode, this.treeData.map(item => {
          return { title: item.title, records: item.records }
        }))
      },

      isNullArray(array) {
        //空の配列オブジェクトかどうかを判別
        if (!array || array.length === 0) {
          return true
        }
        if (array.length === 1) {
          let obj = array[0]
          if (!obj.field || !obj.val || !obj.rule) {
            return true
          }
        }
        return false
      },
      // 配列から空のオブジェクトを削除する
      removeEmptyObject(array) {
        for (let i = 0; i < array.length; i++) {
          let item = array[i]
          if (item == null || Object.keys(item).length <= 0) {
            array.splice(i--, 1)
          }
        }
        return array
      }
    }
  }
</script>

<style lang="scss" scoped>

  .j-super-query-modal {

    /deep/ {
    }

    .j-super-query-history-card /deep/ {
      .ant-card-body,
      .ant-card-head-title {
        padding: 0;
      }

      .ant-card-head {
        padding: 4px 8px;
        min-height: initial;
      }
    }

    .j-super-query-history-empty /deep/ {
      .ant-empty-image {
        height: 80px;
        line-height: 80px;
        margin-bottom: 0;
      }

      img {
        width: 80px;
        height: 65px;
      }

      .ant-empty-description {
        color: #afafaf;
        margin: 8px 0;
      }
    }

    .j-super-query-history-tree /deep/ {
      .ant-tree-switcher {
        display: none;
      }

      .ant-tree-node-content-wrapper {
        width: 100%;
      }
    }

  }

</style>