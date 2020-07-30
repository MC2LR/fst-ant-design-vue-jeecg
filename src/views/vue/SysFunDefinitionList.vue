<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col md="12" :sm="8">
            <a-form-item label="番号">
              <j-input placeholder="番号を入力してください" v-model="queryParam.operatorFunDefinitionCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col md="12" :sm="8">
            <a-form-item label="名前">
              <j-input placeholder="名前を入力してください" v-model="queryParam.controlDisplayName"></j-input>
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

    <sysFunDefinition-modal ref="modalForm" @ok="modalFormOk"></sysFunDefinition-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SysFunDefinitionModal from './modules/SysFunDefinitionModal'
  import JInput from '@/components/jeecg/JInput'
  import { deleteAction, getAction,downFile,postAction } from '@/api/manage'

  export default {
    name: "SysFunDefinitionList",
    mixins:[JeecgListMixin],
    components: {
      SysFunDefinitionModal,
      JInput
    },
    data () {
      return {
        description: 'コントロール関数定義画面',
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
            dataIndex: 'operatorFunDefinitionCode'
          },
          {
            title:'パターン',
            align:"center",
            dataIndex: 'operatorPatternId',
            customRender: (text) => {
              var operatorPattern = '';
              if (text == 0) {
                return "";
              }
              try {
                this.operatorPatternList.forEach(element => {
                  if (element.id == text) {
                    operatorPattern = element.operatorPatternName
                  }
                });
              } catch (error) {
                this.$message.error("line:129 error" + error)
              }
              return operatorPattern
            }
          },
          {
            title:'コントロール',
            align:"center",
            dataIndex: 'operatorControlId',
            customRender: (text) => {
              var operatorControl = '';
              if (text == 0) {
                return "";
              }
              try {
                this.operatorControlList.forEach(element => {
                  if (element.id == text) {
                    operatorControl = element.controlCode
                  }
                });
              } catch (error) {
                this.$message.error("line:152 error" + error)
              }
              return operatorControl
            }
          },
          {
            title:'処理関数',
            align:"center",
            dataIndex: 'operatorFunctionId',
            customRender: (text) => {
              var operatorFunction = '';
              if (text == 0) {
                return "";
              }
              try {
                this.operatorFunctionList.forEach(element => {
                  if (element.id == text) {
                    operatorFunction = element.operatorFunctionName
                  }
                });
              } catch (error) {
                this.$message.error("line:174 error" + error)
              }
              return operatorFunction
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        operatorPatternList:[
        ],
        operatorControlList:[
        ],
        operatorFunctionList:[
        ],
        macAdressList:[],
        url: {
          list: "/test/sysFunDefinition/list",
          delete: "/test/sysFunDefinition/delete",
          deleteBatch: "/test/sysFunDefinition/deleteBatch",
          exportXlsUrl: "/test/sysFunDefinition/exportXls",
          importExcelUrl: "test/sysFunDefinition/importExcel",
          interface:"/test/operatorAreaDefinition/PostManipulator",

          operatorPatternList: "/test/operatorPattern/list2",
          operatorControlList: "/test/operatorControls/list2",
          operatorFunctionList: "/test/operatorFunction/list2",
          macAdressList:"/terminal/terminalInfo/list2"
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
      testinterface(){
        console.log("接口测试2")
        this.loading = true;
        postAction(this.url.interface, {userId:"1226357479944724481"}).then((res) => {
          if (res.success) {
            // this.dataSource = res.result.records;
            // this.ipagination.total = res.result.total;
            console.log("接口测试3")
            console.log(res)
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
      },
      loadData(arg,res) {
        
        console.log("接口测试")
        this.testinterface()
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
        this.loadOperatorPatternList();
        this.loadOperatorControlList();
        this.loadOperatorFunctionList();
        this.loadMacAdressList();
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
      loadOperatorControlList(){
        try {
          getAction(this.url.operatorControlList, {}).then((res) => {
            if (res.success) {
              this.operatorControlList = res.result;
              console.log(this.operatorControlList)
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
      loadOperatorFunctionList(){
        try {
          getAction(this.url.operatorFunctionList, {}).then((res) => {
            if (res.success) {
              this.operatorFunctionList = res.result;
              console.log(this.operatorFunctionList)
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
      loadMacAdressList(){
        try {
          getAction(this.url.macAdressList, {}).then((res) => {
            if (res.success) {
              this.macAdressList = res.result;
              console.log(this.macAdressList)
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
    },
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>