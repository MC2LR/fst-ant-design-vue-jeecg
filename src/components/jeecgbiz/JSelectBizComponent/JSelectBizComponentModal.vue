<template>
  <a-modal
    centered
    :title="name + '選択'"
    :width="900"
    :visible="visible"
    @ok="handleOk"
    @cancel="close"
    cancelText="閉じる">

    <a-row :gutter="18">
      <a-col :span="16">
        <!-- クエリ領域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">

              <a-col :span="14">
                <a-form-item :label="(queryParamText||name)">
                  <a-input :placeholder="'入力' + (queryParamText||name)" v-model="queryParam[valueKey]"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                  <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                    <a-button type="primary" @click="searchQuery" icon="search">検索</a-button>
                    <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">リセット</a-button>
                  </span>
              </a-col>

            </a-row>
          </a-form>
        </div>

        <a-table
          size="small"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :scroll="{ y: 240 }"
          :rowSelection="{selectedRowKeys, onChange: onSelectChange, type: multiple ? 'checkbox':'radio'}"
          :customRow="customRowFn"
          @change="handleTableChange">
        </a-table>

      </a-col>
      <a-col :span="8">
        <a-card :title="'選択済み' + name" :bordered="false" :head-style="{padding:0}" :body-style="{padding:0}">

          <a-table rowKey="id" size="small" bordered v-bind="selectedTable">
              <span slot="action" slot-scope="text, record, index">
                <a @click="handleDeleteSelected(record, index)">削除</a>
              </span>
          </a-table>

        </a-card>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: 'JSelectBizComponentModal',
    mixins: [JeecgListMixin],
    props: {
      value: {
        type: Array,
        default: () => []
      },
      visible: {
        type: Boolean,
        default: false
      },
      valueKey: {
        type: String,
        required: true
      },
      multiple: {
        type: Boolean,
        default: true
      },

      name: {
        type: String,
        default: ''
      },
      listUrl: {
        type: String,
        required: true,
        default: ''
      },
      displayKey: {
        type: String,
        default: null
      },
      propColumns: {
        type: Array,
        default: () => []
      },
      // クエリ条件テキスト
      queryParamText: {
        type: String,
        default: null
      },

    },
    data() {
      return {
        //ヘッダー
        columns: this.propColumns,
        // 選択済みリスト
        selectedTable: {
          pagination: false,
          scroll: { y: 240 },
          columns: [
            this.propColumns[0],
            { title: 'オペレーティング', dataIndex: 'action', align: 'center', width: 60, scopedSlots: { customRender: 'action' }, }
          ],
          dataSource: [],
        },
        url: { list: this.listUrl }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.valueWatchHandler(val)
        }
      },
      dataSource: {
        deep: true,
        handler(val) {
          let options = val.map(data => ({ label: data[this.displayKey || this.valueKey], value: data[this.valueKey] }))
          this.$emit('ok', options)
          this.valueWatchHandler(this.value)
        }
      },
      selectionRows: {
        immediate: true,
        deep: true,
        handler(val) {
          this.selectedTable.dataSource = val
        },
      },
    },

    methods: {

      /** ポップアップを閉じる*/
      close() {
        this.$emit('update:visible', false)
      },

      valueWatchHandler(val) {
        let dataSource = []
        let selectedRowKeys = []
        val.forEach(item => {
          this.dataSource.forEach(data => {
            if (data[this.valueKey] === item) {
              dataSource.push(data)
              selectedRowKeys.push(data.id)
            }
          })
        })
        this.selectedTable.dataSource = dataSource
        this.selectedRowKeys = selectedRowKeys
      },

      /** 選択しました */
      handleOk() {
        let value = this.selectedTable.dataSource.map(data => data[this.valueKey])
        this.$emit('input', value)
        this.close()
      },

      /** 選択済みを削除 */
      handleDeleteSelected(record, index) {
        this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(record.id), 1)
        this.selectedTable.dataSource.splice(index, 1)
      },

      customRowFn(record) {
        if (!this.multiple) {
          return {
            on: {
              click: () => {
                this.selectedRowKeys = [record.id]
                this.selectedTable.dataSource = [record]
              }
            }
          }
        }
        return {}
      },

    }
  }
</script>
<style lang="less" scoped>
</style>