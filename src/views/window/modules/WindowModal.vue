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
       <a-form-item :label="$t('shopName')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-decorator="[ 'bussinessId', validatorRules.bussinessId]" placeholder="请输入业务id"></a-input> -->

          <a-select v-decorator="['shopId', {}]" :placeholder="$t('writeShopName')">
                <a-select-option
                  v-for="(business, index) in shopList"
                  :key="index"
                  :value="business.id"
                >{{ business.name }}</a-select-option>
              </a-select>
        </a-form-item>
        <!-- <a-form-item :label="$t('business_groupName')" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select v-decorator="['bgId', {}]" :placeholder="$t('writeBgName')">
                <a-select-option
                  v-for="(group, index) in GroupList"
                  :key="index"
                  :value="group.id"
                >{{ group.name }}</a-select-option>
              </a-select>
        </a-form-item>-->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import {getAction,downFile } from '@/api/manage'

  export default {
    name: "WindowModal",
    components: { 
    },
    data () { 
      return {
        businessGroup:[],
        GroupList:[],
        shopList:[],
        form: this.$form.createForm(this),
        title:this.$t('operation'),
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
        bussinessId:{},
        },
        url: {
          add: "/test/window/add",
          edit: "/test/window/edit",
          businessList:"/test/bank/listShop",
          //businessGroupList:"/test/businessgtable/listBusinessGroup",
        }
     
      }
    },
    created () {
      this.load();
      //this.loadGroup();
    },
    methods: {
      load(){
         getAction(this.url.businessList).then((res) => {
        if (res) {
        this.shopList = res;
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    }, 

    //loadGroup(){
    //  console.log("enter the loadGroup ")
    //     getAction(this.url.businessGroupList).then((res) => {
    //    if (res!= null) {
    //      console.log(res)
    //      this.GroupList = res;
    //    }
    //    if(res == null){
    //      this.$message.warning(res.message)
    //    }
    //  })
    //}, 

      add (record) {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        console.log("this.model.id:",this.model.id)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'shopId','name','bgId'))
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
        this.form.setFieldsValue(pick(this.model,'shopId','name','bgId'))
        //this.form.setFieldsValue(pick(row,'bussinessId','name','id'))
      },
    }
  }
</script>