<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
         <a-col :md="6" :sm="8">
            <a-form-item  label="受付画面名" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
           <a-select v-model="queryParam.scanId"    placeholder="選択してください" >
           <a-select-option v-for="d in scanIdArrArray" :key="d.id" :value="d.id" >{{d.name}}</a-select-option>
          
        </a-select>
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

    <scheduleInfo-modal ref="modalForm" @ok="modalFormOk"></scheduleInfo-modal>
  </a-card>
</template>

<script>
  import { httpAction,getAction} from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ScheduleInfoModal from './modules/ScheduleInfoModal'

  export default {
    name: "ScheduleInfoList",
    mixins:[JeecgListMixin],
    components: {
      ScheduleInfoModal
    },
    data () {
      return {
        description: 'スケジュール情報管理页面',
        scanIdArrArray:[],
        voiceArr:[{"key":"1","value":"平日"},
               {"key":"2","value":"土曜日"}   ],                                  
                          
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
            title:'受付画面名',
            align:"center",
            dataIndex: 'scanId',
            customRender:(text)=>{
               this.getIconArr;
              console.log(this.scanIdArrArray);
              let dispalyval="";
               this.scanIdArrArray.forEach(element => {
                  
                if (element.id == text) {
                  dispalyval= element.name;
                 
                }
              });
              return dispalyval;
            }
           
          },
            {
            title:'受付日種類',
            align:"center",
            dataIndex: 'dateType',
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
            title:'受付時間',
            align:"center",
            dataIndex: 'startTime',
             customRender:function (t,r,index) {             
              return r.startTime+"~"+r.endTime;
            }
          },          
         
          {
            title:'音声パターン',
            align:"center",
            dataIndex: 'voicePattern',
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
          list: "/schedule/scheduleInfo/list",
          delete: "/schedule/scheduleInfo/delete",
          deleteBatch: "/schedule/scheduleInfo/deleteBatch",
          exportXlsUrl: "/schedule/scheduleInfo/exportXls",
          importExcelUrl: "/schedule/scheduleInfo/importExcel"
           
        },
        dictOptions:{
         scanName:[],
         voicePattern:[],
        },
      }
    },
    computed: {
      
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
      getIconArr()
      {
      let httpurl="/schedule/scheduleInfo/listIcons";
       getAction(httpurl).then((res)=>{
            
               if (res.success) {
                      
                this.scanIdArrArray =res.result || [];    
                console.log("1111111111111="+this.scanIdArrArray);
                            
                
              } 
            }) 
             
       },
    },
     
    methods: {
       getIconLists()
      {
      let httpurl=this.url.listIcons;
       getAction(httpurl).then((res)=>{
            
               if (res.success) {
                      
                this.scanIdArrArray =res.result || [];    
                console.log("1111111111111="+this.scanIdArrArray);
                            
                
              } 
            }) 
             
       },
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>