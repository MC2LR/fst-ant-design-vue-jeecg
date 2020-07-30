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
          <a-input v-decorator="[ 'controlCode', validatorRules.controlCode]" placeholder="番号を入力してください"></a-input>
        </a-form-item>
        <a-form-item label="コントロール名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'operatorControlName', validatorRules.operatorControlName]" placeholder="コントロール名を入力してください"></a-input>
        </a-form-item>
        <a-form-item label="エリア" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'operatorAreaId']" placeholder="エリアを選んでください">
            <a-select-option v-for="(item,index) in operatorAreaList" :key="index.toString()" :value="item.id">{{ item.operatorAreaName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="エリア詳細" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'operatorAreaDetailsId']" placeholder="エリア詳細を選んでください">
            <a-select-option v-for="(item,index) in operatorAreaDetailsList" :key="index.toString()" :value="item.id">{{ item.operatorAreaDetailsName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="パターン" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'operatorPatternId']" placeholder="パターンを選んでください">
            <a-select-option v-for="(item,index) in operatorPatternList" :key="index.toString()" :value="item.id">{{ item.operatorPatternName }}</a-select-option>
          </a-select>
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
    name: "OperatorControlsModal",
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
        operatorAreaList:[
        ],
        operatorAreaDetailsList:[
        ],
        operatorPatternList:[
        ],
        confirmLoading: false,
        validatorRules:{
          controlCode:{
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
          operatorControlName:{},
          operatorAreaId:{},
          operatorAreaDetailsId:{},
          operatorPatternId:{},
        },
        url: {
          add: "/test/operatorControls/add",
          edit: "/test/operatorControls/edit",
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
        this.operatorAreaList = this.$parent.$parent.operatorAreaList;
        this.operatorAreaDetailsList = this.$parent.$parent.operatorAreaDetailsList;
        this.operatorPatternList = this.$parent.$parent.operatorPatternList;

        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'controlCode','operatorControlName','operatorAreaId','operatorAreaDetailsId','operatorPatternId'))
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
        this.form.setFieldsValue(pick(row,'controlCode','operatorControlName','operatorAreaId','operatorAreaDetailsId','operatorPatternId'))
      },
      myValidate(rule, value, callback) {
        var params = {
          tableName: 'm_operator_controls',
          fieldName: 'control_code',
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