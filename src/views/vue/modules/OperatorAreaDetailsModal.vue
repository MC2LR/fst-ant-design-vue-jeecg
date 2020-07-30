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

        <a-form-item label="エリアID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'operatorAreaId', validatorRules.operatorAreaId]" placeholder="请输入エリアID"></a-input>
        </a-form-item>
        <a-form-item label="エリア詳細コード" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'operatorAreaDetailsCode', validatorRules.operatorAreaDetailsCode]" placeholder="请输入エリア詳細コード"></a-input>
        </a-form-item>
        <a-form-item label="エリア詳細名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'operatorAreaDetailsName', validatorRules.operatorAreaDetailsName]" placeholder="请输入エリア詳細名"></a-input>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'

  export default {
    name: "OperatorAreaDetailsModal",
    components: { 
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
        operatorAreaId:{},
        operatorAreaDetailsCode:{},
        operatorAreaDetailsName:{},
        },
        url: {
          add: "/test/operatorAreaDetails/add",
          edit: "/test/operatorAreaDetails/edit",
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
          this.form.setFieldsValue(pick(this.model,'operatorAreaId','operatorAreaDetailsCode','operatorAreaDetailsName'))
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
        this.form.setFieldsValue(pick(row,'operatorAreaId','operatorAreaDetailsCode','operatorAreaDetailsName'))
      },

      
    }
  }
</script>