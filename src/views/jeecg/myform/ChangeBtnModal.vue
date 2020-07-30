<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!-- 主表单区域 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="業務G名"
          hasFeedback>
          <a-input
            placeholder="業務G名を入力してください" 
            v-decorator="['name', {initialValue:name, rules: [{ required: true, message: '業務G名を入力してくださ!' }]}]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="業務G"
          hasFeedback>
          <a-transfer
            :dataSource="mockData"
            showSearch
            :filterOption="filterOption"
            :targetKeys="targetKeys"
            @change="handleChange"
            @search="handleSearch"
            :render="item=>item.title"
          >
          </a-transfer>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import JDate from '@/components/jeecg/JDate'
  import pick from 'lodash.pick'
  import moment from "moment"
  import { getAction } from '@/api/manage'


  export default {
    name: "ChangeBtnModal",
    components: {
      JDate
    },
    data() {
      return {
        headers:{},
        selectBtn:'',
        aid:'',
        name:'',
        mockData: [],
        targetKeys: [],
        title: "操作",
        visible: false,
        orderMainModel: {
          jeecgOrderCustomerList: [{}],
          jeecgOrderTicketList: [{}]
        },
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        url: {
          list: "/test/businessg/list",
          businessList: "/business/businessTable/list2",
          edit: "/test/businessg/edit4",
        },
        parLoadData:''
      }
    },
    mounted() {
    },
    created() {
      // // 現在表示されているtr
      // this.visibleTrEls = []
      // this.disabledRowIds = (this.disabledRowIds || [])
    },
    methods: {
      edit(selectBtn) {
        this.name = selectBtn.name
        this.mockData = [];

        console.log(selectBtn)
        this.mockData.push({
          key:selectBtn.businessTypeId1,
          title:"業務タイプ1",
          description:`description of 業務タイプ1`,
          chosen: true,
        })
        this.targetKeys.push(selectBtn.businessTypeId1)

        this.mockData.push({
          key:selectBtn.businessTypeId2,
          title:"業務タイプ2",
          description:`description of 業務タイプ2`,
          chosen: true,
        })
        this.targetKeys.push(selectBtn.businessTypeId2)

        this.mockData.push({
          key:selectBtn.businessTypeId3,
          title:"業務タイプ3",
          description:`description of 業務タイプ3`,
          chosen: true,
        })
        this.targetKeys.push(selectBtn.businessTypeId3)

        this.mockData.push({
          key:selectBtn.businessTypeId4,
          title:"業務タイプ4",
          description:`description of 業務タイプ4`,
          chosen: true,
        })
        this.targetKeys.push(selectBtn.businessTypeId4)

        this.mockData.push({
          key:selectBtn.businessTypeId5,
          title:"業務タイプ5",
          description:`description of 業務タイプ5`,
          chosen: true,
        })
        this.targetKeys.push(selectBtn.businessTypeId5)


        this.mockData.push({
          key:selectBtn.businessTypeId5+'1',
          title:"業務タイプ6",
          description:`description of 業務タイプ6`,
          chosen: true,
        })

        this.loading = false;
        this.form.resetFields();
        this.orderMainModel = Object.assign({}, '');
        //初始化明细表数据
        this.selectBtn = selectBtn;
        this.visible = true;

      },
      add() {
        this.edit({});
      },
      filterOption(inputValue, option) {
        return option.description.indexOf(inputValue) > -1;
      },
      handleChange(targetKeys, direction, moveKeys) {
        if (targetKeys.length > 5) {
          this.$message.warning('最大5つのデータのみを格納できます')
          return;
        }
        this.targetKeys = targetKeys
        console.log(this.targetKeys)
      },
      handleSearch (dir, value) {
        console.log('search:', dir, value);
      },
      close() {
        this.mockData = [];
        this.targetKeys = [];
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        var mykeys = ''
        this.targetKeys.forEach(element => {
          if (mykeys) {
            mykeys +=','
          }
          mykeys += element;
        });
        getAction(this.url.edit, {groupid:this.selectBtn, keys:mykeys, aid:this.aid}).then((res) => {
          console.log(mykeys)
          if (res.success) {
            console.log('edit 555')
            console.log(res)
            this.$message.success(res.message)
            this.$emit('ok')
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
        this.confirmLoading = false
        this.close()
      },
      handleCancel() {
        this.close()
      }
    }
  }
</script>

<style scoped>
  .ant-btn {
    padding: 0 10px;
    margin-left: 3px;
  }

  .ant-form-item-control {
    line-height: 0px;
  }

  /** 主表单行间距 */
  .ant-form .ant-form-item {
    margin-bottom: 10px;
  }

  /** Tab页面行间距 */
  .ant-tabs-content .ant-form-item {
    margin-bottom: 0px;
  }
</style>