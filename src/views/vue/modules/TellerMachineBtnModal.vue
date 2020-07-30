<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="閉じる">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="番号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'componentsCode', validatorRules.componentsCode]" placeholder="番号を入力してください"></a-input>
        </a-form-item>
        <a-form-item label="コンポーネントURL" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'componentsUrl', validatorRules.componentsUrl]" placeholder="コンポーネントURLを入力してください"></a-input>
        </a-form-item>
        <a-form-item label="コンポーネント名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'componentsName', validatorRules.componentsName]" placeholder="コンポーネント名を入力してください"></a-input>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { duplicateCheck } from '@/api/api'

  export default {
    name: "TellerMachineBtnModal",
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
          componentsUrl:{},
          componentsName:{},
          componentsCode:{
            rules: [
              {
                required: true,
                message: "番号を入力してください"
              },
              {
                validator: this.myValidate
              }
            ]
          },
          parameter:{},
        },
        url: {
          add: "/test/tellerMachineBtn/add",
          edit: "/test/tellerMachineBtn/edit",
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
          this.form.setFieldsValue(pick(this.model,'componentsUrl','componentsName','componentsCode'))
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
        this.form.setFieldsValue(pick(row,'componentsUrl','componentsName','componentsCode'))
      },
      myValidate(rule, value, callback) {
        var params = {
          tableName: 'm_components',
          fieldName: 'components_code',
          fieldVal: value,
          dataId: this.model.id
        }
        duplicateCheck(params).then(res => {
          if (res.success) {
            callback()
          } else {
            callback("データは既に存在します。再入力してください")
          }
        })
      },

      
    }
  }
</script>