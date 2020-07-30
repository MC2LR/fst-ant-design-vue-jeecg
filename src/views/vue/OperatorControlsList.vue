<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col md="12" :sm="8">
            <a-form-item label="番号">
              <j-input placeholder="番号を入力してください" v-model="queryParam.controlCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col md="12" :sm="8">
            <a-form-item label="名前">
              <j-input placeholder="名前を入力してください" v-model="queryParam.operatorControlName"></j-input>
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

    <operatorControls-modal ref="modalForm" @ok="modalFormOk"></operatorControls-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import OperatorControlsModal from './modules/OperatorControlsModal'
  import JInput from '@/components/jeecg/JInput'
  import { deleteAction, getAction,downFile } from '@/api/manage'

  export default {
    name: "OperatorControlsList",
    mixins:[JeecgListMixin],
    components: {
      OperatorControlsModal,
      JInput
    },
    data () {
      return {
        description: '操作機コントロールマスタ画面',
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
            title:'コントロールコード',
            align:"center",
            dataIndex: 'controlCode'
          },
          {
            title:'コントロール名',
            align:"center",
            dataIndex: 'operatorControlName'
          },
          {
            title:'エリアID',
            align:"center",
            dataIndex: 'operatorAreaId',
            customRender: (text) => {
              var operatorArea = '';
              if (text == 0) {
                return "";
              }
              this.operatorAreaList.forEach(element => {
                if (element.id == text) {
                  operatorArea = element.operatorAreaName
                }
              });
              return operatorArea
            }
          },
          {
            title:'エリア詳細ID',
            align:"center",
            dataIndex: 'operatorAreaDetailsId',
            customRender: (text) => {
              var operatorAreaDetails = '';
              if (text == 0) {
                return "";
              }
              this.operatorAreaDetailsList.forEach(element => {
                if (element.id == text) {
                  operatorAreaDetails = element.operatorAreaDetailsName
                }
              });
              return operatorAreaDetails
            }
          },
          {
            title:'パターンID',
            align:"center",
            dataIndex: 'operatorPatternId',
            customRender: (text) => {
              var operatorPattern = '';
              if (text == 0) {
                return "";
              }
              this.operatorPatternList.forEach(element => {
                if (element.id == text) {
                  operatorPattern = element.operatorPatternName
                }
              });
              return operatorPattern
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        operatorAreaList:[],
        operatorAreaDetailsList:[],
        operatorPatternList:[],
        url: {
          list: "/test/operatorControls/list",
          delete: "/test/operatorControls/delete",
          deleteBatch: "/test/operatorControls/deleteBatch",
          exportXlsUrl: "/test/operatorControls/exportXls",
          importExcelUrl: "test/operatorControls/importExcel",
          
          operatorAreaList: "/test/operatorAreaDefinition/list2",
          operatorAreaDetailsList: "/test/operatorAreaDetails/list2",
          operatorPatternList: "/test/operatorPattern/list2",
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
      loadData(arg,res) {
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

        console.log(this.url.list)
        console.log(params)
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
            console.log(res.result.records)
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
        })
        this.loadOperatorAreaList();
        this.loadOperatorAreaDetailsList();
        this.loadOperatorPatternList();
        
        this.loading = false;
      },
      loadOperatorAreaList(){
        
        try {
          getAction(this.url.operatorAreaList, {}).then((res) => {
            if (res.success) {
              this.operatorAreaList = res.result;
              console.log(this.operatorAreaList)
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
      loadOperatorAreaDetailsList(){
        try {
          getAction(this.url.operatorAreaDetailsList, {}).then((res) => {
            if (res.success) {
              this.operatorAreaDetailsList = res.result;
              console.log(this.operatorAreaDetailsList)
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
      loadOperatorPatternList(){
        
        try {
          getAction(this.url.operatorPatternList, {}).then((res) => {
            if (res.success) {
              this.operatorPatternList = res.result;
              console.log(this.operatorPatternList)
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
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>