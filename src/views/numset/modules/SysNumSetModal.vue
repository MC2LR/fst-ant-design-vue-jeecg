<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :cancelText="$t('close')">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item :label="$t('num_name')"  :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'numGroupName', validatorRules.numGroupName]"  :placeholder="$t('input_name')"></a-input>
        </a-form-item>
          <a-form-item label="採番グループコード"  :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'numberGroupCode', validatorRules.numberGroupCode]"  placeholder="採番グループコード入力してください"></a-input>
        </a-form-item>
         <a-form-item label="桁数設定" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select  @change="selectDigit"   placeholder="選択してください"  v-model="digit">
          <a-select-option value="4">4桁の数</a-select-option>
          <a-select-option value="3">3桁の数</a-select-option>           
        </a-select>
      </a-form-item>
        <a-form-item :label="$t('num_start')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input   v-decorator="[ 'startNum', validatorRules.startNum]"      :placeholder="$t('num_input_numstart')"></a-input>
        </a-form-item>
        <a-form-item :label="$t('num_end')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input  v-decorator="[ 'endNum', validatorRules.endNum]"         :placeholder="$t('num_input_numend')" ></a-input>
        </a-form-item>     

       
        
 
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import api from '@/api'
  import { httpAction,postAction,getAction} from '@/api/manage'  
  import pick from 'lodash.pick'
  
  export default {
    name: "SysNumSetModal",    
    data () {
       //自定义下拉框校验函数
    var isSelect = (rule, value, callback) => {
       console.log("===isSelect"); 
       let len= this.digit;
       
      if (value.length>len) { //如果值是 0，提示用户选择正确的选项
        return callback(new Error("正しい桁数を入力してください"));
      } else {
        callback();
      }
    }; 
     var endCheck = (rule, value, callback) => {
       console.log("===endCheck"); 
       let len= this.digit;
       
      if (value.length>len) { //如果值是 0，提示用户选择正确的选项
        return callback(new Error("正しい桁数を入力してください"));
      } else {
        callback();
      }
    }; 
      var checkEndData=(rule,value,callback)=>{
         let data =  this.form.getFieldsValue(); 
        console.log(data.endNum<data.startNum);
        if(data.endNum<data.startNum){
         return  callback(new Error('終了番号が開始番号より大きい必要'));
         
        }else{
          callback();
        }
      };
      return {
        form: this.$form.createForm(this),
        title:"オペレーション",
        width:800,
        visible: false,
        templateDatas:[], //接收下拉框数据的对象
        selectValue:"",       
        dictOptions:[],
        inputCodeContent:"",
        digit:"4",
        roleDisabled: false,
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
       numGroupName:{
            rules: [
              { required: true, message:this.$t("input_name") },
              { min: 2, max: 30, message:this.$t("num_name_long_check"), trigger: 'blur' }
            ],
            },
           numberGroupCode:{
            rules: [
              { required: true, message:'採番グループコード入力してください'},
              { min: 2, max: 30, message:this.$t("num_name_long_check"), trigger: 'blur' }
            ],
            },
             endNum:{
            rules: [
              {required: true,message: this.$t("num_input_numend"),trigger: 'blur'}, 
              {required: true,validator:this.checkStart,trigger: 'change'},
               {required: true,validator:checkEndData,trigger: 'blur'}                 
                            
            ],
            
            },
             startNum:{
            rules: [
              {required: true,message: this.$t("num_input_numstart") , trigger: 'blur'},
              {required: true,validator:this.checkStart,trigger: 'change'} 
                   
                           
            ],
            } 
            
                     
        },
        url: {
          add: "/numset/sysNumSet/add",
          edit: "/numset/sysNumSet/edit",
          queryGroupId:"/numset/sysNumSet/queryGroupIds",
          editGrouoId:"/numset/sysNumSet/getGroupidEdit",
          queryAllGroupIds:"/test/businessgtable/listBusinessGroup"
        }
     
      }
    },
    created () {
      
    },
     computed: {

     },
    methods: {
      selectDigit()
      {
      this.form.setFieldsValue({
        startNum: '',
        endNum:''
 })      
             

      
      },
     
     
     
      add () {
         this.dictOptions=[]; 
        
         this.edit({});
      },
      edit (record) {   
        this.dictOptions=[]; 
        
        if(record.id!=null&&record.id!=""){
        this.roleDisabled = true;  
        this.digit=record.digit;
       
        }else
        {
          this.roleDisabled = false;  
        }
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'numGroupName','numberGroupCode','endNum','startNum','digit'));          
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
            this.model.digit=this.digit;
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
              this.selectValue="";
              that.confirmLoading = false;
              that.close();
            })
          }else
          {
            console.log(err);
          }
         
        })
      },
      handleCancel () {
        this.selectValue="";
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'numGroupName','startNum','endNum','digit','numberGroupCode'))
      },
      checkStart(rule, value, callback)  {
       console.log("===isSelect"); 
       let len= this.digit;
       
      if (value.length>len) { //如果值是 0，提示用户选择正确的选项
        return callback(new Error("正しい桁数を入力してください"));
      } else {
        callback();
      }
    }
      
    }
  }
</script>