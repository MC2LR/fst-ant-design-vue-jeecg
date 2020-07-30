<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col md="12" :sm="8">
            <a-form-item label="番号">
              <j-input placeholder="番号を入力してください" v-model="queryParam.businessGroupCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col md="12" :sm="8">
            <a-form-item label="名前">
              <j-input placeholder="名前を入力してください" v-model="queryParam.businessGroupName"></j-input>
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
        <i class="anticon anticon-info-circle ant-alert-icon"></i> <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>つを選択した
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

    <businessGroup-modal ref="modalForm" @ok="modalFormOk"></businessGroup-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusinessGroupModal from './modules/BusinessGroupModal'
  import { deleteAction, getAction,downFile } from '@/api/manage'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import JInput from '@/components/jeecg/JInput'

  export default {
    name: "BusinessGroupList",
    mixins:[JeecgListMixin],
    components: {
      BusinessGroupModal,
      JInput
    },
    data () {
      return {
        businessTypeList:[],
        businessTypeList_display:[],
        description: '業務グループマスタ管理画面',
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
            dataIndex: 'businessGroupCode'
          },
          {
            title:'業務グループ名',
            align:"center",
            dataIndex: 'businessGroupName'
          },
          {
            title:'業務分類１',
            align:"center",
            dataIndex: 'businessTypeId1',
            customRender: (text) => {
              var businessTypeName = '';
              if (text == 0) {
                return "";
              }
              try {
                this.businessTypeList_display.forEach(element => {
                  if (element.id == text) {
                    businessTypeName = element.businessTypeName
                  }
                });
              } catch (error) {
                this.$message.error("業務分類１ line:151 error" + error)
              }
              return businessTypeName
            }
          },
          {
            title:'業務分類２',
            align:"center",
            dataIndex: 'businessTypeId2',
            customRender: (text) => {
              var businessTypeName = '';
              if (text == 0) {
                return "";
              }
              try {
                this.businessTypeList_display.forEach(element => {
                  if (element.id == text) {
                    businessTypeName = element.businessTypeName
                  }
                });
              } catch (error) {
                this.$message.error("業務分類２ line:169 error")
              }
              return businessTypeName
            }
          },
          {
            title:'業務分類３',
            align:"center",
            dataIndex: 'businessTypeId3',
            customRender: (text) => {
              var businessTypeName = '';
              if (text == 0) {
                return "";
              }
              this.businessTypeList_display.forEach(element => {
                if (element.id == text) {
                  businessTypeName = element.businessTypeName
                }
              });
              return businessTypeName
            }
          },
          {
            title:'業務分類４',
            align:"center",
            dataIndex: 'businessTypeId4',
            customRender: (text) => {
              var businessTypeName = '';
              if (text == 0) {
                return "";
              }
              this.businessTypeList_display.forEach(element => {
                if (element.id == text) {
                  businessTypeName = element.businessTypeName
                }
              });
              return businessTypeName
            }
          },
          {
            title:'業務分類５',
            align:"center",
            dataIndex: 'businessTypeId5',
            customRender: (text) => {
              var businessTypeName = '';
              if (text == 0) {
                return "";
              }
              this.businessTypeList_display.forEach(element => {
                if (element.id == text) {
                  businessTypeName = element.businessTypeName
                }
              });
              return businessTypeName
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          },
        ],
        url: {
          list: "/test/businessGroup/list",
          businessTypeList: "/test/businessType/list2",
          businessTypeList_display: "/test/businessType/list3",
          delete: "/test/businessGroup/del2",
          deleteBatch: "/test/businessGroup/deleteBatch",
          exportXlsUrl: "/test/businessGroup/exportXls",
          importExcelUrl: "test/businessGroup/importExcel",
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
      loadData(arg) {
        if(!this.url.list){
          this.$message.error("url.list属性を設定してください。!")
          return
        }
        //ロードデータがパラメータ1に入力されると、1ページ目のコンテンツがロードされる
        if (arg === 1) {
          this.ipagination.current = 1;
        }

        var params = this.getQueryParams();//問い合わせ条件
        this.loading = true;
        // console.log(params)

        try {
          getAction(this.url.list, params).then((res) => {
            if (res.success) {
              this.dataSource = res.result.records;
              this.ipagination.total = res.result.total;
            }
            if(res.code===510){
              this.$message.warning(res.message)
            }
            this.loading = false;
          })
        } catch (error) {
          this.$message.error("list get error 280line!")
        }
        this.loadBusinessType();
        this.loadBusinessType_display();

      },
      handleEdit: function (record) {
        this.$refs.modalForm.edit(record);
        this.$refs.modalForm.title = this.$t('edit');
        this.$refs.modalForm.disableSubmit = false;
      },
      handleAdd: function () {
        this.$refs.modalForm.add();
        this.$refs.modalForm.title = this.$t('add');
        this.$refs.modalForm.disableSubmit = false;
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
          this.$message.error("del get error 329line!")
        }
      },
      loadBusinessType(){
        try {
          getAction(this.url.businessTypeList, {}).then((res) => {
            if (res.success) {
              this.businessTypeList = res.result;
              console.log(this.businessTypeList)
            }
            if(res.code===510){
              this.$message.warning(res.message)
            }
            this.loading = false;
          })
        } catch (error) {
          this.$message.error("businessTypeList get error 300line!")
        }
      },
      loadBusinessType_display(){
        try {
          getAction(this.url.businessTypeList_display, {}).then((res) => {
            if (res.success) {
              this.businessTypeList_display = res.result;
              console.log(this.businessTypeList_display)
            }
            if(res.code===510){
              this.$message.warning(res.message)
            }
            this.loading = false;
          })
        } catch (error) {
          this.$message.error("businessTypeList get error 280line!")
        }
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>