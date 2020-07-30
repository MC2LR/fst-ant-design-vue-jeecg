<template>
  <a-card :bordered="false">
<div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="24">
            <a-form-item :label="$t('shopId')">
              <j-input :placeholder="$t('writeshopId')" v-model="queryParam.id"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item :label="$t('shopName')">
              <j-input :placeholder="$t('writeShopName')" v-model="queryParam.name"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">{{ $t('query') }} </a-button>
              <!-- <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator" :md="24" :sm="24">
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'bank:addChild'">{{ $t('add') }}</a-button>

      <a-dropdown v-if="selectedRowKeys.length > 0" v-has="'bank:addChild'">
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
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-has="'bank:addChild'">
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <!-- <a href="javascript:;" @click="handleDetail(record)" v-has="'bank:detail'">{{ $t('detail') }}</a> -->
          <a @click="handleEdit(record)" v-has="'bank:editShop'">{{ $t('edit') }}</a>
          <a-divider type="vertical" v-has="'bank:edit'"/>
          <a-dropdown v-has="'bank:edit'">

            <a class="ant-dropdown-link">
              {{ $t('more') }} <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">{{ $t('detail') }}</a>
              </a-menu-item>
              <a-menu-item v-has="'bank:deleteStore'"> 
                <a-popconfirm :title="$t('deleteMessage')" @confirm="() => handleDelete(record.id)">
                  <a>{{ $t('delete') }}</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <jeecgOrderCustomer-modal ref="modalForm" @ok="modalFormOk"></jeecgOrderCustomer-modal>
  </a-card>
</template>

<script>
  import JeecgOrderCustomerModal from './form/JeecgOrderCustomerModal'
  import JeecgOrderDMainList from './Analysis'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {getAction} from '@/api/manage'
  import JInput from '@/components/jeecg/JInput'

  export default {
    name: "JeecgOrderCustomerList",
    mixins: [JeecgListMixin],
    components: {
      JeecgOrderDMainList,
      JeecgOrderCustomerModal,
      JInput
    },
    data() {
      return {
        description: '支行信息',
        // 表头
        columns: [
          {
            title: this.$t('shopName'),
            align: "center",
            width: 100,
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: this.$t('shopaddress'),
            align: "center",
            dataIndex: 'address',
          },
          {
            title: this.$t('phone'),
            dataIndex: 'phonenum',
            align: "center",
          },
          {
            title: this.$t('parent'),
            dataIndex: 'parentName',
            align: "center",
          },
          {
            title: this.$t('ownerName'),
            align: "center",
            dataIndex: 'ownerName'
          },
          {
            title: this.$t('operation'),
            key: 'operation',
            align: 'center',
            width: 130,
            scopedSlots: {customRender: 'action'},
          },
        ],
        url: {
          list: "/test/bank/listByParentId",
          delete: "/test/bank/deleteStore",
          deleteBatch: "/test/bank/deleteBatch",
          listQuery: "/test/bank/listShopQuery"
        }
      }
    },
    methods: {
      loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        //update-begin--Author:kangxiaolin  Date:20190905 for：[442]主子表分开维护，生成的代码子表的分页改为真实的分页--------------------
        var params = this.getQueryParams();
        getAction(this.url.list, {parentId: params.mainId, pageNo : this.ipagination.current,
          pageSize :this.ipagination.pageSize}).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            console.log(res.result.records);
            this.ipagination.total = res.result.total;
          } else {
            this.dataSource = null;
          }
        })
        //update-end--Author:kangxiaolin  Date:20190905 for：[442]主子表分开维护，生成的代码子表的分页改为真实的分页--------------------

      },
      getOrderMain(parentId) {
        this.queryParam.mainId = parentId;
        this.loadData(1);
      },
      handleAdd: function () {
        this.$refs.modalForm.add(this.queryParam.mainId);
        this.$refs.modalForm.title = "店舗情報を追加";
      },
      searchQuery:function(){
        this.selectedRowKeys = [];
        this.selectionRows = [];
        // this.$refs.JeecgOrderCustomerList.queryParam.mainId = null;
        // this.$refs.JeecgOrderCustomerList.loadData();
        // this.$refs.JeecgOrderCustomerList.selectedRowKeys = [];
        // this.$refs.JeecgOrderCustomerList.selectionRows = [];
        this.loadSerchData();
      },
      loadSerchData(arg) {
        console.log("hahahahaahhahahahahah");
      if(!this.url.list){
        // if(!this.url.listQuery){
        this.$message.error("url.list属性を設定してください。!")
        return
      }
      //ロードデータがパラメータ1に入力されると、1ページ目のコンテンツがロードされる
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams();//問い合わせ条件
      // params.mainId=null
      console.log( params);
      console.log(this.url.listQuery);
      console.log(this.url.list);
      this.loading = true;
      getAction(this.url.list, {parentId: params.mainId, pageNo : this.ipagination.current,
          pageSize :this.ipagination.pageSize,id:params.id,name:params.name}).then((res) => {
          // getAction(this.url.listQuery, params).then((res) => {
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
  .ant-card {
    margin-left: -30px;
    margin-right: -30px;
  }
</style>