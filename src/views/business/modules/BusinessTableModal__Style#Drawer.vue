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

        <a-form-item label="業務名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'bname', validatorRules.bname]" placeholder="请输入業務名"></a-input>
        </a-form-item>
        <a-form-item label="発券番号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'bnum', validatorRules.bnum]" placeholder="请输入発券番号"></a-input>
        </a-form-item>
        <a-form-item label="业务优先度设置" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'level', validatorRules.level]" placeholder="请输入业务优先度设置"></a-input>
        </a-form-item>
        <a-form-item label="业务平均处理时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'averageTime', validatorRules.averageTime]" placeholder="请输入业务平均处理时间" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="发券有效等待人数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'peopleNum', validatorRules.peopleNum]" placeholder="请输入发券有效等待人数" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="一括呼出デフォルト数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'wholeNum', validatorRules.wholeNum]" placeholder="请输入一括呼出デフォルト数" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="まとめ呼出しデフォルト数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'batchNum', validatorRules.batchNum]" placeholder="请输入まとめ呼出しデフォルト数" style="width: 100%"/>
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
    name: "BusinessTableModal",
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
        bname:{},
        bnum:{},
        level:{},
        averageTime:{},
        peopleNum:{},
        wholeNum:{},
        batchNum:{},
        },
        url: {
          add: "/business/businessTable/add",
          edit: "/business/businessTable/edit",
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
          this.form.setFieldsValue(pick(this.model,'bname','bnum','level','averageTime','peopleNum','wholeNum','batchNum'))
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
        this.form.setFieldsValue(pick(row,'bname','bnum','level','averageTime','peopleNum','wholeNum','batchNum'))
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