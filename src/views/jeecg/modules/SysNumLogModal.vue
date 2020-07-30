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

        <a-form-item label="业务groupid" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'busgroupid', validatorRules.busgroupid]" placeholder="请输入业务groupid"></a-input>
        </a-form-item>
        <a-form-item label="番号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'num', validatorRules.num]" placeholder="请输入番号"></a-input>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'state', validatorRules.state]" placeholder="请输入状态"></a-input>
        </a-form-item>
        <a-form-item label="番号時間" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'numdate', validatorRules.numdate]" placeholder="请输入番号時間"></a-input>
        </a-form-item>
        <a-form-item label="削除flag" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'deleteflag', validatorRules.deleteflag]" placeholder="请输入削除flag"></a-input>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'

  export default {
    name: "SysNumLogModal",
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
        busgroupid:{},
        num:{},
        state:{},
        numdate:{},
        deleteflag:{},
        },
        url: {
          add: "/numlog/sysNumLog/add",
          edit: "/numlog/sysNumLog/edit",
        }
     
      }
    },
    created () {
      this.test();
    },
    methods: {
      add () {
        this.edit({});
      },
      test()
      {
        alert(123);
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'busgroupid','num','state','numdate','deleteflag'))
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
        this.form.setFieldsValue(pick(row,'busgroupid','num','state','numdate','deleteflag'))
      },

      
    }
  }
</script>