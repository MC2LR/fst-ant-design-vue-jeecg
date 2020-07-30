<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
    <!--
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>-->

    <!-- table区域-begin -->
    <div>
       <a-tabs defaultActiveKey="1" tabPosition="left">
        <a-tab-pane tab="ドメイン設定" key="1">
          <Jeecg-Order-Customer-List ref="JeecgOrderCustomerList"></Jeecg-Order-Customer-List>
        </a-tab-pane>
        <a-tab-pane tab="チャイム設定" key="2" forceRender>
          <Jeecg-Order-Ticket-List ref="JeecgOrderTicketList"></Jeecg-Order-Ticket-List>
        </a-tab-pane>
        <a-tab-pane tab="表示区分設定" key="3" forceRender>
          <Jeecg-Order-Acount-List ref="JeecgOrderAcountList"></Jeecg-Order-Acount-List>
        </a-tab-pane>
      </a-tabs>
    </div>

    <storeMaintenance-modal ref="modalForm" @ok="modalFormOk"></storeMaintenance-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import StoreMaintenanceModal from './modules/StoreMaintenanceModal'

  export default {
    name: "StoreMaintenanceList",
    mixins:[JeecgListMixin],
    components: {
      StoreMaintenanceModal
    },
    data () {
      return {
        description: '店舗メンテナンス管理页面',
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
            title:'事前预约可否',
            align:"center",
            dataIndex: 'orderFlag',
            customRender:(text)=>{
              if(!text){
                return ''
              }else{
                return filterMultiDictText(this.dictOptions['orderFlag'], text+"")
              }
            }
          },
          {
            title:'预约开始时间',
            align:"center",
            dataIndex: 'orderDateStart'
          },
          {
            title:'预约结束时间',
            align:"center",
            dataIndex: 'orderDateEnd'
          },
          {
            title:'预约间隔时间',
            align:"center",
            dataIndex: 'orderDateInterval'
          },
          {
            title:'呼出list通知件数',
            align:"center",
            dataIndex: 'notificationsNumber'
          },
          {
            title:'リセット時間',
            align:"center",
            dataIndex: 'resetDate'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/Maintenance/storeMaintenance/list",
          delete: "/Maintenance/storeMaintenance/delete",
          deleteBatch: "/Maintenance/storeMaintenance/deleteBatch",
          exportXlsUrl: "/Maintenance/storeMaintenance/exportXls",
          importExcelUrl: "Maintenance/storeMaintenance/importExcel",
        },
        dictOptions:{
         orderFlag:[],
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
        initDictOptions('').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'orderFlag', res.result)
          }
        })
      }
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>