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
        <a-form-item :label="$t('windowName')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'name', validatorRules.name]" :placeholder="$t('writeWindowName')"></a-input>
        </a-form-item>
        <a-form-item :label="$t('code')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'code', validatorRules.code]" :placeholder="$t('writeCode')"></a-input>
        </a-form-item>
        <a-form-item :label="$t('companyName')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-decorator="[ 'companyId', validatorRules.companyId]" placeholder="请输入企业id"></a-input> -->
          <a-select v-decorator="['companyId', {rules: [{ required: true, message: this.$t('selectCompany') }]}]" :placeholder="$t('selectCompany')" @change="getShop">
                <a-select-option
                  v-for="(company, index) in companyMap"
                  :key="index"
                  :value="company.id"
                >{{ company.name }}</a-select-option>
              </a-select>
        </a-form-item>
        <a-form-item :label="$t('shopName')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-decorator="[ 'shopId', validatorRules.shopId]" placeholder="请输入店铺id"></a-input> -->
          <a-select v-decorator="['shopId', {rules: [{ required: true, message: this.$t('writeShopName') }]}]" :placeholder="$t('writeShopName')">
                <a-select-option
                  v-for="(shop, index) in shopMap"
                  :key="index"
                  :value="shop.id"
                >{{ shop.name }}</a-select-option>
              </a-select>
        </a-form-item>
        <a-form-item :label="$t('windowCode')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'windowCode', validatorRules.windowCode]" :placeholder="$t('writeWindowCode')"></a-input>
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
    name: "MasterShopWindowModal",
    components: { 
    },
    data () {
      return {
        companyMap:[],
        shopMap:[],
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
        name:{rules: [{ required: true, message: this.$t('writeWindowName') }]},
        code:{rules: [{ required: true, message: this.$t('writeCode') }]},
        companyId:{},
        shopId:{},
        windowCode:{rules: [{ required: true, message: this.$t('windowCode') }]},
        },
        url: {
          add: "/test/masterShopWindow/add",
          edit: "/test/masterShopWindow/edit",
          companyList:"/test/bank/list",
          shopList:"/test/masterPictureLayout/listByParentId",
          shopAll: "/test/masterShopWindow/getShop",
        }
     
      }
    },
    created () {
      this.loadCompany();
      this.loadShopALL();
    },
    methods: {
      loadCompany(){
         getAction(this.url.companyList).then((res) => {
        if (res.success) {
          console.log(res);
        this.companyMap=res.result.records;
        console.log(this.companyMap);
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
    loadShopALL(){
         getAction(this.url.shopAll).then((res) => {
        if (res.success) {
          console.log( 'load shop all is ');
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
      getAction(this.url.shopAll, {parentId: value}).then((res) => {
        if (res.success) {
          console.log("getshop is success");
          this.shopMap=res.result;
        }
        if(res.code===510){
          
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
          this.form.setFieldsValue(pick(this.model,'code','companyId','shopId','windowCode','name'))
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
        this.form.setFieldsValue(pick(row,'code','companyId','shopId','windowCode'))
      },

      
    }
  }
</script>