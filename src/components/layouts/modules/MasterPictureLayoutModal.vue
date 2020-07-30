<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :cancelText="$t('close')">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="$t('companyName')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-decorator="[ 'sys_org_code', validatorRules.shopId]" placeholder="请输入所属企业"></a-input> -->
          <a-select v-decorator="['enterpriseId', {}]" :placeholder="$t('selectCompany')" @change="getShop">
                <a-select-option
                  v-for="(company, index) in companyMap"
                  :key="index"
                  :value="company.id"
                >{{ company.name }}</a-select-option>
              </a-select>
        </a-form-item>
        <a-form-item :label="$t('shopName')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-decorator="[ 'shopId', validatorRules.shopId]" placeholder="请输入所属店铺"></a-input> -->
          <a-select v-decorator="['shopId', {}]" :placeholder="$t('writeShopName')">
                <a-select-option
                  v-for="(shop, index) in shopMap"
                  :key="index"
                  :value="shop.id"
                >{{ shop.name }}</a-select-option>
              </a-select>
        </a-form-item>
        <a-form-item :label="$t('areaDefCode')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'monitorAreaCode', validatorRules.monitorAreaCode]" :placeholder="$t('writeAreaDefCode')"></a-input>
        </a-form-item>
        <a-form-item :label="$t('areaDefNmae')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'name', validatorRules.name]" :placeholder="$t('writeAreaDefName')"></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import {getAction,downFile } from '@/api/manage'
  export default {
    name: "MasterPictureLayoutModal",
    components: { 
    },
    data () {
      return {
        companyMap:[],
        shopMap:[],
        compentList:[],
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        validatorRules:{
        shopId:{},
        enterpriseId:{},
        name:{},
        monitorAreaCode:{},
        },
        url: {
          add: "/test/mstMonitorAreaDefinition/add",
          edit: "/test/mstMonitorAreaDefinition/edit",
          companyList:"/test/bank/list",
          shopList:"/test/masterPictureLayout/listByParentId",
          shop:"/test/masterShopWindow/getShop",
        }
     
      }
    },
    created () {
      this.loadCompany();
      this.loadshop();
    },
    methods: {
      loadCompany(){
         getAction(this.url.companyList).then((res) => {
        if (res.success) {
        this.companyMap=res.result.records;
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
    loadshop(){
      console.log('enter the loadshop model')
         getAction(this.url.shop).then((res) => {
        if (res.success) {
          console.log(res);
        this.shopMap=res.result;
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    }, 
    getShop(value) {
      console.log(value)
      getAction(this.url.shopList, {parentId: value}).then((res) => {
        if (res.success) {
          this.shopMap=res.result;
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'shopId','enterpriseId','name','monitorAreaCode'))
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
         
        })
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'shopId','layoutType','layoutOne','layoutTwo','layoutThree'))
      },

      
    }
  }
</script>