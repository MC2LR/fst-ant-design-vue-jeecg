<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
         <a-row :gutter="24">
         <a-col :md="6" :sm="8">
            <a-form-item  label="端末名" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input :placeholder="$t('num_input_namequery')" v-model="queryParam.terminalName"></a-input>
            </a-form-item>            
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item  label="端末コード" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input placeholder="エンドコードを入力してください" v-model="queryParam.terminalCode"></a-input>
            </a-form-item>

          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="searchQuery">{{$t('num_serch')}}</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">リセット</a-button>

            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
   <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">{{$t('add')}}</a-button>
       
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>{{$t('num_del')}}</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> {{$t('num_batch_op')}} <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      
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
          <a @click="handleEdit(record)">{{$t('edit')}}</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">もっと <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm :title="$t('deleteMessage')"  @confirm="() => handleDelete(record.id)">
                  <a>{{$t('num_del')}}</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <terminalInfo-modal ref="modalForm" @ok="modalFormOk"></terminalInfo-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TerminalInfoModal from './modules/TerminalInfoModal'
  import { httpAction,getAction} from '@/api/manage'
  export default {
    name: "TerminalInfoList",
    mixins:[JeecgListMixin],
    components: {
      TerminalInfoModal
    },
    data () {
      
      return {
          voiceArr:[{"key":"1","value":"受付機"},
               {"key":"2","value":"操作機"},
               {"key":"3","value":"店内モニタ"}],   
           scanIdArr:[],     
        description: '终端信息管理页面',
        // 表头
        columns: [
           {
            title:'端末コード',
            align:"center",
            dataIndex: 'terminalCode'
          },
          
          {
            title:'端末名',
            align:"center",
            dataIndex: 'terminalName'            
          },
           {
            title:'窓口名',
            align:"center",
            dataIndex: 'sysWindowCode',
            customRender:(text)=>{
               this.getWindowIds;            
               let dispalyval="";
               this.scanIdArr.forEach(element => {
                  
                if (element.id == text) {
                  dispalyval= element.name;
                 
                }
              });
              return dispalyval;
            }
          },
          {
            title:'HOST名',
            align:"center",
            dataIndex: 'hostName'
          },
          {
            title:'MACアドレス',
            align:"center",
            dataIndex: 'macAdress'
          },
          {
            title:'機種名',
            align:"center",
            dataIndex: 'modelName'
          },
          {
            title:'接続先URL',
            align:"center",
            dataIndex: 'destinationUrl'
          },
          {
            title:'端末の区分',
            align:"center",
            dataIndex: 'terminalSegment',
             customRender:(text)=>{            
              let dispalyval="";
               this.voiceArr.forEach(element => {                   
                if (element.key == text) {
                  dispalyval= element.value;
                 
                }
              });
              return dispalyval;
            }
          },
          {
            title: 'オペレーション',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/terminal/terminalInfo/list",
          delete: "/terminal/terminalInfo/delete",
          deleteBatch: "/terminal/terminalInfo/deleteBatch",
          exportXlsUrl: "/terminal/terminalInfo/exportXls",
          importExcelUrl: "/terminal/terminalInfo/importExcel",
          listWindows:"/terminal/terminalInfo/listWindows"
        },
        dictOptions:{
         terminalSegment:[],
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
      getWindowIds()
      {    
       let httpurl=this.url.listWindows;
       getAction(httpurl).then((res)=>{
       console.log(res);
            
               if (res.success)
                {
                     
                this. scanIdArr=res.result || [];  
                           
                
              } 
            }) 
       }
    },
    methods: {
      
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>