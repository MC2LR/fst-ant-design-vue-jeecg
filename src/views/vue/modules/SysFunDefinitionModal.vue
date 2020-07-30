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
          <a-input v-decorator="[ 'operatorFunDefinitionCode', validatorRules.operatorFunDefinitionCode]" placeholder="番号を入力してください"></a-input>
        </a-form-item>
        <a-form-item label="パターン" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'operatorPatternId']" placeholder="パターンを選んでください" v-model="operatorPatternId">
            <a-select-option v-for="(operatorPattern,index) in operatorPatternList" :key="index.toString()" :value="operatorPattern.id">{{ operatorPattern.operatorPatternName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="コントロール" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'operatorControlId']" placeholder="コントロールを選んでください">
            <a-select-option v-for="(operatorControl,index) in filteredOptions" :key="index.toString()" :value="operatorControl.id">{{ operatorControl.controlCode }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="処理関数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'operatorFunctionId']" placeholder="処理関数を選んでください">
            <a-select-option v-for="(operatorFunction,index) in operatorFunctionList" :key="index.toString()" :value="operatorFunction.id">{{ operatorFunction.operatorFunctionName }}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item label="MacAdress" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'macAdress']" placeholder="MacAdressを選んでください">
            <a-select-option v-for="(macAdress,index) in macAdressList" :key="index.toString()" :value="macAdress.macAdress">{{ macAdress.terminalName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="パラメータ" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['parameter']" rows="4" placeholder="パラメータを入力してください"/>
        </a-form-item>
        <a-form-item label="API インターフェース名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'apiInterfaceName', validatorRules.apiInterfaceName]" placeholder="API インターフェース名を入力してください"></a-input>
        </a-form-item>
        <a-form-item label="コントロール表示内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['controlDisplayName']" rows="4" placeholder="コントロール表示内容を入力してください"/>
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
    name: "SysFunDefinitionModal",
    components: { 
    },
    computed: {
      filteredOptions() {
        return this.operatorControlList.filter(
          o => this.operatorPatternId.includes(o.operatorPatternId)
        )
      },
    },
    data () {
      return {
        operatorPatternId:"",
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
          operatorFunDefinitionCode:{
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
          operatorPatternId:{},
          operatorControlId:{},
          operatorFunctionId:{},
          // macAdress:{},
          // parameter:{},
          // apiInterfaceName:{},
          // controlDisplayName:{},
        },
        operatorPatternList:[
        ],
        operatorControlList:[
        ],
        operatorFunctionList:[
        ],
        // macAdressList:[],
        url: {
          add: "/test/sysFunDefinition/add",
          edit: "/test/sysFunDefinition/edit",
          
          // operatorPatternList: "/test/operatorPattern/list2",
          // operatorControlList: "/test/operatorControls/list2",
          // operatorFunctionList: "/test/operatorFunction/list2",
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
        
        this.operatorPatternList = this.$parent.$parent.operatorPatternList;
        this.operatorControlList = this.$parent.$parent.operatorControlList;
        this.operatorFunctionList = this.$parent.$parent.operatorFunctionList;
        // this.macAdressList = this.$parent.$parent.macAdressList;
        // console.log(this.$parent.$parent.macAdressList)

        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          console.log(this.model)
          this.form.setFieldsValue(pick(this.model,'operatorFunDefinitionCode','operatorPatternId','operatorControlId','operatorFunctionId'))
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
        this.form.setFieldsValue(pick(row,'operatorFunDefinitionCode','operatorPatternId','operatorControlId','operatorFunctionId'))
      },
      myValidate(rule, value, callback) {
        var params = {
          tableName: 'sys_operator_fun_definition',
          fieldName: 'operator_fun_definition_code',
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