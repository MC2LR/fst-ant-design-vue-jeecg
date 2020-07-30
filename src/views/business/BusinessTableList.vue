<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
             <!-- <a-col :md="6" :sm="8">
            <a-form-item :label="$t('bid')">
              <a-input placeholder="" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('bname')">
              <j-input placeholder="" v-model="queryParam.bname"></j-input>
            </a-form-item>
          </a-col>
           <a-col :md="6" :sm="24" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">{{$t('query')}}</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{$t('reset')}}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">{{$t('add')}}</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls($t('businessGroup'))">{{$t('export')}}</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">{{$t('import')}}</a-button>
      </a-upload> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>{{$t('delete')}}</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> {{$t('bath')}} <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> {{$t('choicen')}} <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>{{$t('option')}}
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

        <!-- <template slot="htmlSlot" slot-scope="text">
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
        </template> -->

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">{{$t('edit')}}</a>

          <a-divider type="vertical" />
          <!-- <a-dropdown>
            <a class="ant-dropdown-link">{{$t('more')}}<a-icon type="down" /></a>
            <a-menu slot="overlay"> -->
              <!-- <a-menu-item>
                  <a>{{$t('copy')}}</a>
              </a-menu-item>
              <a-menu-item>
                  <a>{{$t('change')}}</a>
              </a-menu-item> -->
              <!-- <a-menu-item> -->
                <a-popconfirm :title="$t('deleteMessage')" @confirm="() => handleDelete(record.id)">
                  <a>{{$t('delete')}}</a>
                </a-popconfirm>
              <!-- </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>

      </a-table>
    </div>

    <businessTable-modal ref="modalForm" @ok="modalFormOk"></businessTable-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusinessTableModal from './modules/BusinessTableModal'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue';
  import JInput from '@/components/jeecg/JInput.vue';
  import { getAction } from '@/api/manage'
  export default {
    name: "BusinessTableList",
    mixins:[JeecgListMixin],
    components: {
      BusinessTableModal,JSuperQuery,JInput
    },
    data () {
      return {
        description: '業務テーブル管理页面',
        // 表头
        columns: [
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key:'rowIndex',
          //   width:60,
          //   align:"center",
          //   customRender:function (t,r,index) {
          //     return parseInt(index)+1;
          //   }
          // },
          {
            title:this.$t('bid'),
            align:"center",
            dataIndex: 'id'
          },
          {
            title:this.$t('bname'),
            align:"center",
            dataIndex: 'bname'
          },
          // {
          //   title:this.$t('ticketNum'),
          //   align:"center",
          //   dataIndex: 'bnum'
          // },
          {
            title:this.$t('level'),
            align:"center",
            dataIndex: 'level',
             customRender:function(text,record,index){
              return  text + "番"
            }
          },
          {
            title:this.$t('averageTime'),
            align:"center",
            dataIndex: 'averageTime',
             customRender:function(text,record,index){
              return  text + "分"
            }
          },
          {
            title:this.$t('peopleNum'),
            align:"center",
            dataIndex: 'numId',
            customRender:function(text,record,index){
              return  "業務区分 "+text
            }
          //   customRender: text => {
          //   var num = ''
          //   this.numSet.forEach(element => {
          //     if (element.id == text) {
          //       num = element.numGroupName
          //     }
          //   })
          //   return num
          // }
          },
          // {
          //   title:this.$t('wholeNum'),
          //   align:"center",
          //   dataIndex: 'machineId'
          // },
          // {
          //   title:this.$t('batchNum'),
          //   align:"center",
          //   dataIndex: 'batchNum'
          // },
          {
            title: this.$t('operation'),
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/business/businessTable/list",
          delete: "/business/businessTable/delete",
          deleteBatch: "/business/businessTable/deleteBatch",
          exportXlsUrl: "/business/businessTable/exportXls",
          importExcelUrl: "business/businessTable/importExcel",
          numSetUrl: "/numset/sysNumSet/list",
        },
        numSet: [],
        dictOptions:{
        },
      }
    },
    created() {
    // this.getNumset()
  },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      },
      getNumset() {
      getAction(this.url.numSetUrl).then(res => {
        this.numSet = []
        if (res.success) {
          this.numSet = res.result.records
          console.log(this.numSet)
        } else {
          this.dataSource = null
          console.log('报错啦')
        }
      })
    },
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>