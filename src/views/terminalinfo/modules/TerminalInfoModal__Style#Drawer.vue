<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible">
  
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="终端名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'name', validatorRules.name]" placeholder="请输入终端名称"></a-input>
        </a-form-item>
        <a-form-item label="HOST名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'hostName', validatorRules.hostName]" placeholder="请输入HOST名"></a-input>
        </a-form-item>
        <a-form-item label="MAC地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'macAdress', validatorRules.macAdress]" placeholder="请输入MAC地址"></a-input>
        </a-form-item>
        <a-form-item label="機種名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'modelName', validatorRules.modelName]" placeholder="请输入機種名"></a-input>
        </a-form-item>
        <a-form-item label="链接URL" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'destinationUrl', validatorRules.destinationUrl]" placeholder="请输入链接URL"></a-input>
        </a-form-item>
        <a-form-item label="终端区分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['terminalSegment']" :trigger-change="true" dictCode="" placeholder="请选择终端区分"/>
        </a-form-item>
        
      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  
  export default {
    name: "TerminalInfoModal",
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
        name:{rules: [{ required: true, message: '请输入终端名称!' }]},
        hostName:{rules: [{ required: true, message: '请输入HOST名!' }]},
        macAdress:{rules: [{ required: true, message: '请输入MAC地址!' }]},
        modelName:{rules: [{ required: true, message: '请输入機種名!' }]},
        destinationUrl:{rules: [{ required: true, message: '请输入链接URL!' }]},
        terminalSegment:{rules: [{ required: true, message: '请输入终端区分!' }]},
        },
        url: {
          add: "/org.jeecg.modules.system.terminalinfo/terminalInfo/add",
          edit: "/org.jeecg.modules.system.terminalinfo/terminalInfo/edit",
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
          this.form.setFieldsValue(pick(this.model,'name','hostName','macAdress','modelName','destinationUrl','terminalSegment'))
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
        this.form.setFieldsValue(pick(row,'name','hostName','macAdress','modelName','destinationUrl','terminalSegment'))
      }
      
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>