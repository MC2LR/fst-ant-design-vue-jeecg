<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="事前预约可否" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['orderFlag']" :trigger-change="true" dictCode="" placeholder="请选择事前预约可否"/>
        </a-form-item>
        <a-form-item label="预约开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'orderDateStart', validatorRules.orderDateStart]" placeholder="请输入预约开始时间"></a-input>
        </a-form-item>
        <a-form-item label="预约结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'orderDateEnd', validatorRules.orderDateEnd]" placeholder="请输入预约结束时间"></a-input>
        </a-form-item>
        <a-form-item label="预约间隔时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'orderDateInterval', validatorRules.orderDateInterval]" placeholder="请输入预约间隔时间" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="呼出list通知件数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'notificationsNumber', validatorRules.notificationsNumber]" placeholder="请输入呼出list通知件数" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="リセット時間" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'resetDate', validatorRules.resetDate]" placeholder="请输入リセット時間"></a-input>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"

  export default {
    name: "StoreMaintenanceModal",
    components: { 
      JDictSelectTag,
    },
    data () {
      return {
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
        orderFlag:{},
        orderDateStart:{},
        orderDateEnd:{},
        orderDateInterval:{},
        notificationsNumber:{},
        resetDate:{},
        },
        url: {
          add: "/Maintenance/storeMaintenance/add",
          edit: "/Maintenance/storeMaintenance/edit",
        }
     
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'orderFlag','orderDateStart','orderDateEnd','orderDateInterval','notificationsNumber','resetDate'))
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
        this.form.setFieldsValue(pick(row,'orderFlag','orderDateStart','orderDateEnd','orderDateInterval','notificationsNumber','resetDate'))
      },

      
    }
  }
</script>