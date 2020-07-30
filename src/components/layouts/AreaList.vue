<template>
  <a-card :bordered="false">

      <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" >
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item :label="$t('pictureName')">
              <j-input :placeholder="$t('WritePictureName')" v-model="queryParam.name"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search" >{{ $t('query') }} </a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{ $t('reset') }}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus" >{{ $t('add') }}</a-button>

      <a-dropdown v-if="selectedRowKeys.length > 0" >
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            {{ $t('delete') }}
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> {{ $t('bath') }}
          <a-icon type="down"/>
        </a-button>
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
        filterMultiple="filterMultiple"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:type}"
        @change="handleTableChange"
        :customRow="clickThenCheck"
      >

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">{{ $t('edit') }}</a>
          <a-divider type="vertical" />
          <a-popconfirm :title="$t('deleteMessage')" @confirm="() => handleDelete(record.id)">
            <a>{{ $t('delete') }}</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <a-tabs defaultActiveKey="1" v-show="taskShow">
      <a-tab-pane :tab="$t('areaDeatilInfo')" key="1">
        <Area-Deatil-List ref="AreaDeatilList"></Area-Deatil-List>
      </a-tab-pane>
    </a-tabs>

    <!-- 表单区域 -->
    <MasterPictureLayout-modal ref="modalForm" @ok="modalFormOk"></MasterPictureLayout-modal>

  </a-card>
</template>

<script>
  import MasterPictureLayoutModal from './modules/MasterPictureLayoutModal'
  import AreaDeatilList from './AreaDeatilList'
  import {deleteAction} from '@/api/manage'
  import AreaDeatilModal from './modules/AreaDeatilModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {getAction,downFile } from '@/api/manage'
  import JInput from '@/components/jeecg/JInput'

  export default {
    name: "JeecgOrderDMainList",
    mixins: [JeecgListMixin],
    components: {
      AreaDeatilModal,
      MasterPictureLayoutModal,
      AreaDeatilList,
      JInput
    },
    data() {
      return {
        description: '画面类型定义管理',
        taskShow: null,
        companyList:[],
        shopList:[],
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        // 表头
        columns: [{
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          }
        },
          {
            title: this.$t('companyName'),
            align: "center",
            dataIndex: 'enterpriseId',
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
            title: this.$t('shopName'),
            align: "center",
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
            title: this.$t('areaDefCode'),
            align: "center",
            dataIndex: 'monitorAreaCode'
          },
          {
            title: this.$t('areaDefNmae'),
            align: "center",
            dataIndex: 'name'
          },
          {
            title: this.$t('operation'),
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
            
          }],
        // 分页参数
        type: "radio",
        url: {
          list: "/test/mstMonitorAreaDefinition/list",
          delete: "/test/mstMonitorAreaDefinition/delete",
          deleteBatch: "/test/mstMonitorAreaDefinition/deleteBatch",
          company:"/test/bank/list",
          shop:"/test/masterShopWindow/getShop",
        },
      }
    },
    created () {
      this.loadCompany();
      this.loadshop();
    },
    methods: {
      clickThenCheck(record) {
        return {
          on: {
            click: () => {
              this.onSelectChange(record.id.split(","), [record]);
            }
          }
        };
      },
      loadCompany(){
         getAction(this.url.company).then((res) => {
        if (res.success) {
        this.companyList=res.result.records;
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
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
        this.$refs.AreaDeatilList.getOrderMain(this.selectedRowKeys[0]);
        this.taskShow=true;
      },
      onClearSelected() {
        this.selectedRowKeys = [];
        this.selectionRows = [];
        this.$refs.AreaDeatilList.queryParam.mainId = null;
        this.$refs.AreaDeatilList.loadData();
        this.$refs.AreaDeatilList.selectedRowKeys = [];
        this.$refs.AreaDeatilList.selectionRows = [];
      },

      handleDelete: function (id) {
        var that = this;
        deleteAction(that.url.delete, {id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
            this.$refs.AreaDeatilList.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      searchQuery:function(){
        this.selectedRowKeys = [];
        this.selectionRows = [];
        // this.$refs.JeecgOrderCustomerList.queryParam.mainId = null;
        // this.$refs.JeecgOrderCustomerList.loadData();
        // this.$refs.JeecgOrderCustomerList.selectedRowKeys = [];
        // this.$refs.JeecgOrderCustomerList.selectionRows = [];
        this.loadSerchData();
        this.taskShow = false;
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
    },
    }
  }
</script>
<style scoped>
  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>