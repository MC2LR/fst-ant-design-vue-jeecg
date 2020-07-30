<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <!-- 查询区域 -->
    <!-- <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="24">
            <a-form-item :label = "布局id">
              <a-input :placeholder = "请输入布局id" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">id
            <a-form-item :label="$t('windowName')">
              <a-input :placeholder="$t('writeWindowName')" v-model="queryParam.name"></a-input>
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
    </div> -->
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">{{ $t('add') }}</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('操作机画面布局')">{{ $t('export') }}</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">{{ $t('import') }}</a-button>
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

    <masterPictureLayout-modal ref="modalForm" @ok="modalFormOk"></masterPictureLayout-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MasterPictureLayoutModal from './modules/MasterPictureLayoutModal'
  import {getAction,downFile } from '@/api/manage'
  export default {
    name: "MasterPictureLayoutList",
    mixins:[JeecgListMixin],
    components: {
      MasterPictureLayoutModal
    },
    data () {
      return {
        description: '操作机画面布局管理页面',
        companyList:[],
        shopList:[],
        equipment:[],
        compentList:[],
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
            dataIndex: 'sysOrgCode',
            customRender: (text) => {
              var companyName = '';
              this.companyList.forEach(element => {
                if (element.id == text) {
                  companyName = element.name
                }
              });
              return companyName
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
            title:this.$t('layOutType'),
            align:"center",
            dataIndex: 'layoutType'
            
          },
          {
            title:this.$t('compment'),
            align:"center",
            dataIndex: 'layoutOne',
            customRender: (text) => {
              var shopName = '';
              this.compentList.forEach(element => {
                if (element.id == text) {
                  shopName = element.name
                }
              });
              return shopName
            }
          },
          {
            title:this.$t('compment'),
            align:"center",
            dataIndex: 'layoutTwo',
            customRender: (text) => {
              var shopName = '';
              this.compentList.forEach(element => {
                if (element.id == text) {
                  shopName = element.name
                }
              });
              return shopName
            }
          },
          {
            title:this.$t('compment'),
            align:"center",
            dataIndex: 'layoutThree',
            customRender: (text) => {
              var shopName = '';
              this.compentList.forEach(element => {
                if (element.id == text) {
                  shopName = element.name
                }
              });
              return shopName
            }
          },
          {
            title:this.$t('machine'),
            align:"center",
            dataIndex: 'machineId',
            customRender: (text) => {
              var machineName = '';
              this.equipment.forEach(element => {
                if (element.id == text) {
                  machineName = element.name
                }
              });
              return machineName
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
          list: "/test/masterPictureLayout/list",
          delete: "/test/masterPictureLayout/delete",
          deleteBatch: "/test/masterPictureLayout/deleteBatch",
          exportXlsUrl: "/test/masterPictureLayout/exportXls",
          importExcelUrl: "test/masterPictureLayout/importExcel",
          company: "test/masterPictureLayout/getAllCompany",
          shop: "test/masterPictureLayout/getAllShop",
          machineList:"/test/masterPictureLayout/listMachine",
          compents:"/test/subassembleMaster/list"
        },
        dictOptions:{
        },
      }
    },
    created () {
      this.loadcompany();
      this.loadshop();
      this.loadMachine();
      this.loadCompents();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      },
      loadMachine(){
        console.log("enter the loadmachine")
         getAction(this.url.machineList).then((res) => {
        if (res.success) {
          console.log(res)
          this.equipment=res.result;
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
    loadCompents(){
         getAction(this.url.compents).then((res) => {
        if (res.success) {
        this.compentList=res.result.records;
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
      loadcompany(){
        console.log("enter the loadcompany")
         getAction(this.url.company).then((res) => {
        if (res.success) {
          console.log(res)
          
          this.companyList=res.result;

        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
    loadshop(){
         getAction(this.url.shop).then((res) => {
        if (res.success) {
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