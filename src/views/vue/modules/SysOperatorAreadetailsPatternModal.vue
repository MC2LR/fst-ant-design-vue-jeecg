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

        <a-form-item label="名前" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'name', validatorRules.name]" placeholder="请输入エリア名前"></a-input>
        </a-form-item>
        <!-- <a-form-item label="エリア" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'operatorAreaId']" placeholder="エリアを選んでください">
            <a-select-option v-for="(operatorArea,index) in operatorAreaList" :key="index.toString()" :value="operatorArea.id">{{ operatorArea.operatorAreaName }}</a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item label="パターン" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'operatorPatternId']" placeholder="パターンを選んでください" :allowClear="true">
            <a-select-option v-for="(operatorPattern,index) in operatorPatternList" :key="index.toString()" :value="operatorPattern.id">{{ operatorPattern.operatorPatternName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="エリア詳細" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'operatorAreaDetailsId']" placeholder="エリア詳細を選んでください" :allowClear="true">
            <a-select-option v-for="(operatorAreaDetails,index) in operatorAreaDetailsList" :key="index.toString()" :value="operatorAreaDetails.id">{{ operatorAreaDetails.operatorAreaDetailsName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="利用者" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'userId']" placeholder="利用者を選んでください" :allowClear="true" >
            <a-select-option v-for="(user,index) in userList" :key="index.toString()" :value="user.id">{{ user.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item label="端末" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'terminalId']" placeholder="端末を選んでください" :allowClear="true" >
            <a-select-option v-for="(terminal,index) in terminalList" :key="index.toString()" :value="terminal.id">{{ terminal.terminalName }}</a-select-option>
          </a-select>
        </a-form-item> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { duplicateCheck } from '@/api/api'

  export default {
    name: "SysOperatorAreadetailsPatternModal",
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
          // operatorAreaId:{},
          name:{},
          operatorAreaDetailsId:{},
          operatorPatternId:{},
          userId:{},
          // terminalId:{},
        },
        // operatorAreaList:[],
        operatorAreaDetailsList:[],
        operatorPatternList:[],
        // terminalList:[],
        userList:[],
        url: {
          add: "/test/sysOperatorAreadetailsPattern/add",
          edit: "/test/sysOperatorAreadetailsPattern/edit",
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
        // this.operatorAreaList = this.$parent.$parent.operatorAreaList;
        this.operatorAreaDetailsList = this.$parent.$parent.operatorAreaDetailsList;
        this.operatorPatternList = this.$parent.$parent.operatorPatternList;
        this.userList = this.$parent.$parent.userList;
        console.log(this.userList)
        // this.terminalList = this.$parent.$parent.terminalList;


        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'name','operatorAreaDetailsId','operatorPatternId','userId'))
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
        this.form.setFieldsValue(pick(row,'name','operatorAreaDetailsId','operatorPatternId','userId'))
      },
      // setOperatorAreaDetailsIdToNull(){
      //   this.form.setFieldsValue(pick({operatorAreaDetailsId:""},'operatorAreaDetailsId'))
      // }
    }
  }
</script>