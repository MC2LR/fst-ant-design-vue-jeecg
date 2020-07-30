<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
         <a-col :md="8" :sm="8">
            <a-form-item  label="採番グループ名" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input  placeholder="番号のグループ名を入力してください" v-model="queryParam.numGroupName"></a-input>
            </a-form-item>
          </a-col>
            <a-col :md="8" :sm="8">
            <a-form-item  label="採番グループコード" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input placeholder="採番グループコード入力してください" v-model="queryParam.numberGroupCode"></a-input>
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
          <span v-if="!text" style="font-size: 12px;font-style: italic;"> {{$t('num_no_pic')}}</span>
          <img v-else :src="getImgView(text)" height="25px" :alt="$t('num_pic_exist')" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">{{$t('num_no_file')}}</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="uploadFile(text)">
            {{$t('num_download')}}
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)"> {{$t('edit')}}</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">もっと <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm :title="$t('deleteMessage')" @confirm="() => handleDelete(record.id)">
                  <a>{{$t('num_del')}}</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <sysNumSet-modal ref="modalForm" @ok="modalFormOk"></sysNumSet-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SysNumSetModal from './modules/SysNumSetModal'

  export default {
    name: "SysNumSetList",
    mixins:[JeecgListMixin],
    components: {
      SysNumSetModal
    },
    data () {
      return {
        description:this.$t("num_num_set_manager"),
        digitArr:[{"key":"4","value":"4桁の数"},
                 {"key":"3","value":"3桁の数"}],
        // 表头
        columns: [
         
          {
            title:'採番グループコード',
            align:"center",
            dataIndex: 'numberGroupCode'
          },
          {
            title:'採番グループ名',
            align:"center",
            dataIndex: 'numGroupName'
          },
          {
            title:this.$t('num_range'),
            align:"center",
            dataIndex: 'startNum',
              customRender:function (t,r,index) {             
              return r.startNum+"~"+r.endNum;
            }
          },
           {
            title:"桁数設定",
            align:"center",
            dataIndex:'digit',
              customRender:(text)=>{
                let dispalyval="";
               this.digitArr.forEach(element => {
                  
                if (element.key == text) {
                  dispalyval= element.value;
                 
                }
              });
              return dispalyval;
            }
          },
           
          {
            title: this.$t('operation'),
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/numset/sysNumSet/list",
          delete: "/numset/sysNumSet/delete",
          deleteBatch: "/numset/sysNumSet/deleteBatch",
          exportXlsUrl: "/numset/sysNumSet/exportXls",
          importExcelUrl: "numset/sysNumSet/importExcel",
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