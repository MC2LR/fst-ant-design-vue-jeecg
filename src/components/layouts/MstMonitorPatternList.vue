<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <!-- <a-col :md="6" :sm="24">
            <a-form-item :label="$t('windowId')">
              <a-input :placeholder="$t('writeWindow')" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :md="6" :sm="24">
            <a-form-item :label="$t('patternName')">
              <a-input :placeholder="$t('writePatternName')" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">{{ $t('query') }} </a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{ $t('reset') }}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">{{ $t('add') }}</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('pattern')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>{{ $t('delete') }}</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> {{ $t('bath') }} <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> {{ $t('choicen') }} <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">{{ $t('clear') }}</a>
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

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无此图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="图片不存在" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无此文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="uploadFile(text)">
            {{ $t('download') }}
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">{{ $t('edit') }}</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">{{ $t('more') }} <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm :title="$t('deleteMessage')" @confirm="() => handleDelete(record.id)">
                  <a>{{ $t('delete') }}</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <mstMonitorPattern-modal ref="modalForm" @ok="modalFormOk"></mstMonitorPattern-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MstMonitorPatternModal from './modules/MstMonitorPatternModal'
  import {getAction,downFile } from '@/api/manage'
  export default {
    name: "MstMonitorPatternList",
    mixins:[JeecgListMixin],
    components: {
      MstMonitorPatternModal
    },
    data () {
      return {
        description: 'pattern管理页面',
        companyList:[],
        shopList:[],
        areaDefs:[],
        areaDeatils:[],
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
            title:this.$t('companyName'),
            align:"center",
            dataIndex: 'enterpriseId',
            customRender: (text) => {
              var shopName = '';
              this.companyList.forEach(element => {
                if (element.id == text) {
                  shopName = element.name
                }
              });
              return shopName
            }
          },
          {
            title:this.$t('shopName'),
            align:"center",
            dataIndex: 'shopId',
            customRender: (text) => {
              var shopName = '';
              this.shopList.forEach(element => {
                if (element.id == text) {
                  shopName = element.name
                }
              });
              return shopName
            }
          },
          {
            title:this.$t('areaDefNmae'),
            align:"center",
            dataIndex: 'monitorAreaId',
            customRender: (text) => {
              var shopName = '';
              this.areaDefs.forEach(element => {
                if (element.id == text) {
                  shopName = element.name
                }
              });
              return shopName
            }
          },
          {
            title:this.$t('areaDeatilName'),
            align:"center",
            dataIndex: 'monitorAreaDetailsId',
            customRender: (text) => {
              var shopName = '';
              this.areaDeatils.forEach(element => {
                if (element.id == text) {
                  shopName = element.name
                }
              });
              return shopName
            }
          },
          {
            title:this.$t('patternCode'),
            align:"center",
            dataIndex: 'monitorPatternCode'
          },
          {
            title:this.$t('patternName'),
            align:"center",
            dataIndex: 'monitorPatternName'
          },
          {
            title:this.$t('patternUrl'),
            align:"center",
            dataIndex: 'monitorPatternUrl'
          },
          {
            title: this.$t('operation'),
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/test/mstMonitorPattern/list",
          delete: "/test/mstMonitorPattern/delete",
          deleteBatch: "/test/mstMonitorPattern/deleteBatch",
          exportXlsUrl: "/test/mstMonitorPattern/exportXls",
          importExcelUrl: "test/mstMonitorPattern/importExcel",
          companyList:"/test/bank/list",
          shopList:"/test/masterShopWindow/getShop",
          areaDdfs:"/test/mstMonitorAreaDefinition/list",
          areaDeatils:"/test/mstMonitorAreaDetails/list",
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
    created () {
      this.loadShop();
      this.loadCompany();
      this.loadAreaDef();
      this.loadAreaDeatil();
    },
    methods: {
      initDictConfig(){
      },
      searchQuery:function(){
        this.selectedRowKeys = [];
        this.selectionRows = [];
        this.loadSerchData();
      },
      loadSerchData(arg) {
      if(!this.url.list){
        this.$message.error("url.list属性を設定してください。!")
        return
      }
      //ロードデータがパラメータ1に入力されると、1ページ目のコンテンツがロードされる
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams();//問い合わせ条件ad
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
    },
      loadCompany(){
         getAction(this.url.companyList).then((res) => {
        if (res.success) {
          console.log(res);
        this.companyList=res.result.records;
        console.log(this.companyMap);
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
    loadAreaDef(value){
         getAction(this.url.areaDdfs).then((res) => {
        if (res.success) {
          console.log(res);
        this.areaDefs=res.result.records;
        console.log(this.areaDefs);
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
    loadAreaDeatil(){
         getAction(this.url.areaDeatils).then((res) => {
        if (res.success) {
          console.log(res);
        this.areaDeatils=res.result.records;
        console.log(this.areaDeatils);
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
    loadShop(){
         getAction(this.url.shopList).then((res) => {
        if (res.success) {
          console.log( 'load shop all is ');
          console.log(res);
        this.shopList=res.result;
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>