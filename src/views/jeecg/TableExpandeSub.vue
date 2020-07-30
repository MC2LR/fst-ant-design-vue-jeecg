<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="2" :sm="6">
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item label="操作">
              <a-row :gutter="24">
                <a-col :md="5" :sm="5">
                    <a-button type="primary" @click="addBtn" icon="plus">{{$t('businessAdd')}}</a-button>
                </a-col>
                <!-- <a-col :md="6" :sm="6">
                    <a-button  type="primary" @click="loadData" icon="reload">{{$t('reset')}}</a-button>
                </a-col> -->
                <a-col :md="6" :sm="6">
                    <a-button v-show="selectBtn" type="primary" @click="changeBtn" icon="fix">{{$t('businessChange')}}</a-button>
                </a-col>
                <a-col :md="5" :sm="5">
                  
                  <a-popconfirm
                    title="削除してもよろしいですか？"
                    @confirm="delBtn">
                      <a-button v-show="selectBtn" type="primary" icon="delete">{{$t('businessDel')}}</a-button>
                    <span class="gap"></span>
                  </a-popconfirm>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class='btngroup'>
      <a-row v-for="(item, index) in businessGroupList" :key="index" type="flex" justify="center">
        <a-col :md="20" :sm="24">
          <a-button @click="selectBtn=item" block type="dashede" size="large">{{item.groupItem}}</a-button>
        </a-col>
      </a-row>
    </div>
    <ChangeBtn-modal ref="modalForm" @ok="modalFormOk"></ChangeBtn-modal>
  </a-card>
</template>

<script>
  import { getAction,postAction } from '@/api/manage'
  import ChangeBtnModal from '@/views/jeecg/myform/ChangeBtnModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "TableDemo",
    mixins: [JeecgListMixin],
    components: {
      ChangeBtnModal
    },
    data() {
      return {
        btnNum:0,
        businessGroupList:[
        ],
        two2List:[
        ],
        selectBtn:'',
        aid:'a01',
        url: {
          list: "/test/businessg/list",

          groupList: "/test/businessGroup/list",
          groupAdd: "/test/businessGroup/add2",
          groupDel: "/test/businessGroup/del2",

          delete: "/test/order/delete",
          deleteBatch: "/test/order/deleteBatch",
          customerListByMainId: "/test/order/listOrderCustomerByMainId",
        },
      }
    },
    computed: {
      currentId(){
        return this.id;
      }
    },
    methods: {
      modalFormOk() {
        this.selectBtn = ''
        // 新規/修正が成功した場合,リストをオーバロードする
        this.loadData();
        console.log('loadData ok')
      },
      loadData(arg) {
        console.log('loaddata')
        this.businessGroupList = [];

        // get group
        // getAction(this.url.groupList, {enterpriseId:'1',shopId:'1',isdel:'0'}).then((res) => {
        getAction(this.url.groupList, {isdel:'0'}).then((res) => {
          if (res.success) {
            console.log(res.result)
            var result = res.result.records;
            this.btnNum = result.length;
            result.forEach(element => {
              var groupItem = '';
              if (element.businessTypeId1) {
                groupItem += element.businessTypeId1
              }
              if (element.businessTypeId2) {
                if (groupItem) {
                  groupItem += '・'
                }
                groupItem += element.businessTypeId2
              }
              if (element.businessTypeId3) {
                if (groupItem) {
                  groupItem += '・'
                }
                groupItem += element.businessTypeId3
              }
              if (element.businessTypeId4) {
                if (groupItem) {
                  groupItem += '・'
                }
                groupItem += element.businessTypeId4
              }
              if (element.businessTypeId5) {
                if (groupItem) {
                  groupItem += '・'
                }
                groupItem += element.businessTypeId5
              }
              this.businessGroupList.push({
                id:element.id,
                name:element.businessGroupName,
                groupItem:groupItem,
                businessTypeId1:''+element.businessTypeId1,
                businessTypeId2:''+element.businessTypeId2,
                businessTypeId3:''+element.businessTypeId3,
                businessTypeId4:''+element.businessTypeId4,
                businessTypeId5:''+element.businessTypeId5,
              })
            });
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
        })
        this.selectBtn = '';
        this.loading = false;
      },
      changeBtn: function () {
        this.$refs.modalForm.edit(this.selectBtn);
        this.$refs.modalForm.title = "ボータン設定";
        this.$refs.modalForm.disableSubmit = false;
      },
      addBtn: function () {
        getAction(this.url.groupAdd, {enterpriseId:'1',shopId:'1',isdel:'0'}).then((res) => {
          this.businessGroupList = [];
          console.log(res)
          if (res.success) {
            this.$message.success(res.message)
            this.loadData();
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
        })
      },
      delBtn: function () {
        console.log(this.selectBtn.id)
        // if (this.selectBtn.groupItem.length) {
        //   this.$message.warning("業務分類あるので、削除できません！")
        // } else {
        getAction(this.url.groupDel, {id:this.selectBtn.id}).then((res) => {
          this.businessGroupList = [];
          console.log(res)
          if (res.success) {
            this.$message.success(res.message)
            this.loadData();
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
        })
        // }
      },
    }
  }
  Array.prototype.indexOf = function(val) { 
    for (var i = 0; i < this.length; i++) { 
    if (this[i] == val) return i; 
    } 
    return -1; 
  };
  Array.prototype.remove = function(val) { 
    var index = this.indexOf(val); 
    if (index > -1) { 
    this.splice(index, 1); 
    } 
  };
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

  .ant-btn-dashede {
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
  div.btngroup .ant-btn {
    margin-bottom: 20px;
  }
</style>