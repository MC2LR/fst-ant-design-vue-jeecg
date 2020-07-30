<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col md="12" :sm="8">
            <a-form-item label="番号">
              <j-input placeholder="番号を入力してください" v-model="queryParam.layoutCode"></j-input>
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
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('受付機')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>削除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">一括削除<a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>  <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>件を選ぶ
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

    <receptionMachine-modal ref="modalForm" @ok="modalFormOk"></receptionMachine-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ReceptionMachineModal from './modules/ReceptionMachineModal'
  import { deleteAction, getAction,downFile } from '@/api/manage'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import JInput from '@/components/jeecg/JInput'

  export default {
    name: "ReceptionMachineList",
    mixins:[JeecgListMixin],
    components: {
      ReceptionMachineModal,
      JInput
    },
    data () {
      return {
        description: '受付機管理页面',
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
            dataIndex: 'layoutCode'
          },
          {
            title:'受付画面名',
            align:"center",
            dataIndex: 'name'
          },
          // {
          //   title:'ロゴ',
          //   align:"center",
          //   dataIndex: 'logo'
          // },
          // {
          //   title:'業務ボタン数',
          //   align:"center",
          //   dataIndex: 'businessBtnNum'
          // },
          // {
          //   title:'背景色',
          //   align:"center",
          //   dataIndex: 'backgroundColor',
          //   customRender: (text) => {
          //     switch (text) {
          //       case "255,0,0":
          //         return "赤色";
          //         break;
          //       case "255,255,0":
          //         return "黄色";
          //         break;
          //       case "0,0,255":
          //         return "青い";
          //         break;
          //       case "0,128,0":
          //         return "緑色";
          //         break;
          //       case "128,0,128":
          //         return "パープル";
          //         break;
          //       case "255,192,203":
          //         return "ピンク";
          //         break;
          //       default:
          //         return "その他";
          //         break;
          //     }
          //   }
          // },
          // {
          //   title:'業務G配置',
          //   align:"center",
          //   dataIndex: 'businessGroup'
          // },
          {
            title:'待ち表示',
            align:"center",
            dataIndex: 'waitDisplay',
            customRender: (text) => {
              switch (text) {
                case "0":
                  return "不表示";
                  break;
                case "1":
                  return "表示";
                  break;
                default:
                  return "その他";
                  break;
              }
            }
          },
          {
            title:'キャンペーン文言',
            align:"center",
            dataIndex: 'campaignText'
          },
          {
            title:'ヘルプボタン有無',
            align:"center",
            dataIndex: 'helpBtnDisplay',
            customRender: (text) => {
              switch (text) {
                case "0":
                  return "不表示";
                  break;
                case "1":
                  return "表示";
                  break;
                default:
                  return "その他";
                  break;
              }
            }
          },
          {
            title:'利用者ID',
            align:"center",
            dataIndex: 'userId'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/test/receptionMachine/list",
          delete: "/test/receptionMachine/del2",
          deleteBatch: "/test/receptionMachine/deleteBatch",
          exportXlsUrl: "/test/receptionMachine/exportXls",
          importExcelUrl: "test/receptionMachine/importExcel",
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
      },
      handleDelete: function (id) {
        if(!this.url.delete){
          this.$message.error("url.delete属性を設定してください。!")
          return
        }
        var that = this;
        try {
          getAction(that.url.delete, {id: id}).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.loadData();
            } else {
              that.$message.warning(res.message);
            }
          });
        } catch (error) {
          this.$message.error("del error 270line!")
        }
      },
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>