<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col md="12" :sm="8">
            <a-form-item label="番号">
              <j-input placeholder="番号を入力してください" v-model="queryParam.operatorFunctionCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col md="12" :sm="8">
            <a-form-item label="名前">
              <j-input placeholder="名前を入力してください" v-model="queryParam.operatorFunctionName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">検索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">リセット</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">追加</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>削除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 一括削除 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i><a style="font-weight: 600">{{ selectedRowKeys.length }}</a>つを選択した
        <a style="margin-left: 24px" @click="onClearSelected">クリア</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{fixed:true,selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">編集</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">もっと <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="削除か?" @confirm="() => handleDelete(record.id)">
                  <a>削除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <operatorFunction-modal ref="modalForm" @ok="modalFormOk"></operatorFunction-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import OperatorFunctionModal from './modules/OperatorFunctionModal'
  import JInput from '@/components/jeecg/JInput'
  import { deleteAction, getAction,downFile } from '@/api/manage'

  export default {
    name: "OperatorFunctionList",
    mixins:[JeecgListMixin],
    components: {
      OperatorFunctionModal,
      JInput
    },
    data () {
      return {
        description: '操作機関数定義マスタ画面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'関数定義コード',
            align:"center",
            dataIndex: 'operatorFunctionCode'
          },
          {
            title:'関数定義名',
            align:"center",
            dataIndex: 'operatorFunctionName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/test/operatorFunction/list",
          delete: "/test/operatorFunction/delete",
          deleteBatch: "/test/operatorFunction/deleteBatch",
          exportXlsUrl: "/test/operatorFunction/exportXls",
          importExcelUrl: "test/operatorFunction/importExcel",
        },
        dictOptions:{
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      }
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>