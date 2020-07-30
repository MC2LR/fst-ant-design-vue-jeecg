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
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">{{$t('add')}}</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('業務分類')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>{{$t('selected')}}  <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">{{$t('clear')}}</a>
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
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">{{$t('edit')}} </a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">{{$t('more')}} <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm :title="$t('deleteMessage')" @confirm="() => handleDelete(record.id)">
                  <a>{{$t('delete')}}</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <businessType-modal ref="modalForm" @ok="modalFormOk"></businessType-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusinessTypeModal from './modules/BusinessTypeModal'

  export default {
    name: "BusinessTypeList",
    mixins:[JeecgListMixin],
    components: {
      BusinessTypeModal
    },
    data () {
      return {
        description: '業務分類画面',
        // 表头
        columns: [
          //{
          //  title: '#',
          //  dataIndex: '',
          //  key:'rowIndex',
          //  width:60,
          //  align:"center",
          //  customRender:function (t,r,index) {
          //    return parseInt(index)+1;
          //  }
          //},
          {
            title:'業務分類名',
            align:"center",
            dataIndex: 'businessTypeName'
          },
          {
            title:'業務分類コード',
            align:"center",
            dataIndex: 'typeCode'
          },
          {
            title:'業務階層１',
            align:"center",
            dataIndex: 'bname1'
          },
          {
            title:'業務階層２',
            align:"center",
            dataIndex: 'bname2'
          },
          {
            title:'業務階層３',
            align:"center",
            dataIndex: 'bname3'
          },
          {
            title:'業務階層４',
            align:"center",
            dataIndex: 'bname4'
          },
          {
            title:'業務階層５',
            align:"center",
            dataIndex: 'bname5'
          },
          //{
          //  title:this.$t('averageTime'),
          //  align:"center",
          //  dataIndex: 'averageTime',
          //   customRender:function(text,record,index){
          //    return  text + "分"
          //  }
          //},
          {
            title:'採番グループ',
            align:"center",
            dataIndex: 'numGroupName'
          },
          {
            title:'窓口',
            align:"center",
            dataIndex: 'windowNames'
          },
          {
            title:'均処理時間',
            align:"center",
            dataIndex: 'averageTime',
            customRender:function(text,record,index){
              return  text==null?"":text + "分"
            }
          },
          {
            title: this.$t("operation"),
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/test/businessType/list",
          delete: "/test/businessType/delete",
          deleteBatch: "/test/businessType/deleteBatch",
          exportXlsUrl: "/test/businessType/exportXls",
          importExcelUrl: "test/businessType/importExcel",
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