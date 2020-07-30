<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col md="12" :sm="8">
            <a-form-item label="番号">
              <j-input placeholder="番号を入力してください" v-model="queryParam.logoCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col md="12" :sm="8">
            <a-form-item label="名前">
              <j-input placeholder="名前を入力してください" v-model="queryParam.name"></j-input>
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
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('ロゴ')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
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
        <i class="anticon anticon-info-circle ant-alert-icon"></i>  <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>つを選択した
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

    <logo-modal ref="modalForm" @ok="modalFormOk"></logo-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import LogoModal from './modules/LogoModal'
  import JInput from '@/components/jeecg/JInput'

  export default {
    name: "LogoList",
    mixins:[JeecgListMixin],
    components: {
      LogoModal,
      JInput
    },
    data () {
      return {
        description: 'ロゴ管理ページ',
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
            title:'番号',
            align:"center",
            dataIndex: 'logoCode'
          },
          {
            title:'ロゴ名',
            align:"center",
            dataIndex: 'name'
          },
          {
            title:'ロゴタイプ',
            align:"center",
            dataIndex: 'type',
            customRender:function (text) {
              if (text == 1) {
                return "店内モニタ用ロゴ大（サイズ：◇px×▲px）"
              }
              if (text == 2) {
                return "店内モニタ用ロゴ小（サイズ：■px×○px）"
              }
              if (text == 3) {
                return "受付画面用ロゴ（サイズ：○px×△px）"
              }
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/test/logo/list",
          delete: "/test/logo/delete",
          deleteBatch: "/test/logo/deleteBatch",
          exportXlsUrl: "/test/logo/exportXls",
          importExcelUrl: "test/logo/importExcel",
          imgServer: window._CONFIG['domianURL'] + "/sys/common/view/",
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