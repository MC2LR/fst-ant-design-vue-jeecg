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

        <a-form-item label="所属店铺" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'shopId', validatorRules.shopId]" placeholder="请输入所属店铺"></a-input>
        </a-form-item>
        <a-form-item label="区域定义Id" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'monitorAreaId', validatorRules.monitorAreaId]" placeholder="请输入区域定义Id"></a-input>
        </a-form-item>
        <a-form-item label="区域详细ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'monitorAreaDetailsId', validatorRules.monitorAreaDetailsId]" placeholder="请输入区域详细ID"></a-input>
        </a-form-item>
        <a-form-item label="patternCode" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'monitorPatternCode', validatorRules.monitorPatternCode]" placeholder="请输入patternCode"></a-input>
        </a-form-item>
        <a-form-item label="patternName" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  
  export default {
    name: "MstMonitorPatternModal",
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