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

        <a-form-item label="所属店铺" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['shopId', {rules: [{ required: true, message: this.$t('writeShopName') }]}]" :placeholder="$t('writeShopName')" @change="getAreaInfo">
                <a-select-option
                  v-for="(shop, index) in shopMap"
                  :key="index"
                  :value="shop.id"
                >{{ shop.name }}</a-select-option>
              </a-select>
        </a-form-item>
        <a-form-item label="所属企业" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['enterpriseId', {rules: [{ required: true, message: this.$t('selectCompany') }]}]" :placeholder="$t('selectCompany')">
                <a-select-option
                  v-for="(company, index) in companyMap"
                  :key="index"
                  :value="company.id"
                >{{ company.name }}</a-select-option>
              </a-select>
        </a-form-item>
        <a-form-item label="区域定义Id" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-decorator="[ 'monitorAreaId', validatorRules.monitorAreaId]" placeholder="请输入区域定义Id"></a-input> -->
          <a-select  v-decorator="['monitorAreaId', {rules: [{ required: true, message: this.$t('selectCompany') }]}]" :placeholder="$t('selectCompany')">
                <a-select-option
                  v-for="(area, index) in areaDefs"
                  :key="index"
                  :value="area.id"
                >{{ area.name }}</a-select-option>
              </a-select>
        </a-form-item>
        <a-form-item label="区域详细ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-decorator="[ 'monitorAreaDetailsId', validatorRules.monitorAreaDetailsId]" placeholder="请输入区域详细ID"></a-input> -->
          <a-select  v-decorator="['monitorAreaDetailsId', {rules: [{ required: true, message: this.$t('selectCompany') }]}]" :placeholder="$t('selectCompany')">
                <a-select-option
                  v-for="(areadeatil, index) in areaDeatil"
                  :key="index"
                  :value="areadeatil.id"
                >{{ areadeatil.name }}</a-select-option>
              </a-select>
        </a-form-item>
        <a-form-item label="组件番号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'monitorPatternCode', validatorRules.monitorPatternCode]" placeholder="请输入patternCode"></a-input>
        </a-form-item>
        <a-form-item label="组件名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'monitorPatternName', validatorRules.monitorPatternName]" placeholder="请输入patternName"></a-input>
        </a-form-item>
        <a-form-item label="组件URL" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'monitorPatternUrl', validatorRules.monitorPatternUrl]" placeholder="请输入组件URL"></a-input>
        </a-form-item>
        <a-form-item label="删除标志" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'delFlg', validatorRules.delFlg]" placeholder="请输入删除标志" style="width: 100%"/>
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
    name: "MstMonitorPatternModal",
    components: { 
    },
    data () {
      return {
        shopMap:[],
        companyMap:[],
        areaDefs:[],
        areaDeatil:[],
        first:'',
        second:'',
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
        monitorAreaId:{},
        monitorAreaDetailsId:{},
        monitorPatternCode:{},
        monitorPatternName:{},
        monitorPatternUrl:{},
        delFlg:{},
        },
        url: {
          add: "/test/mstMonitorPattern/add",
          edit: "/test/mstMonitorPattern/edit",
          companyList:"/test/bank/list",
          shopAll: "/test/masterShopWindow/getShop",
          areaDdf:"/test/mstMonitorAreaDefinition/queryByShopId",
          areaDeatil:"/test/mstMonitorAreaDetails/queryByShopId",
        }
     
      }
    },
    created () {
      this.loadShop();
      this.loadCompany();
      // this.loadAreaDef();
      // this.loadAreaDeatil();
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
     getAreaInfo(value){
       this.areaDefs=[];
       this.areaDeatil=[];
        getAction(this.url.areaDdf, {shopId: value}).then((res) => {
        if (res.success) {
          this.areaDefs=res.result;
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
      getAction(this.url.areaDeatil, {shopId: value}).then((res) => {
        if (res.success) {
          this.areaDeatil=res.result;
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
    loadAreaDef(value){
         
    },
    loadAreaDeatil(){
         getAction(this.url.areaDeatil).then((res) => {
        if (res.success) {
          console.log(res);
        this.areaDeatil=res.result.records;
        console.log(this.areaDeatil);
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
    loadShop(){
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
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'shopId','monitorAreaId','monitorAreaDetailsId','monitorPatternCode','monitorPatternName','monitorPatternUrl','delFlg'))
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
        this.form.setFieldsValue(pick(row,'shopId','monitorAreaId','monitorAreaDetailsId','monitorPatternCode','monitorPatternName','monitorPatternUrl','delFlg'))
      },

      
    }
  }
</script>