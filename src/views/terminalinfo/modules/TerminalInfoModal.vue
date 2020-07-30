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
          <a-form-item label="端末コード" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'terminalCode', validatorRules.terminalCode]" placeholder="入力してください"></a-input>
        </a-form-item>
        <a-form-item label="端末の区分" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select  v-decorator="['terminalSegment',{rules: [{ required: true, message: '端末を選んでください。' }]}]"  @change="selectType"  placeholder="選んでください" >
          <a-select-option value="1">受付機</a-select-option>
          <a-select-option value="2">操作機</a-select-option>
           <a-select-option value="3">店内モニタ</a-select-option>
        </a-select>
      </a-form-item>
       <a-form-item  v-if='displayflag'  label="窓口名" :labelCol="labelCol" :wrapperCol="wrapperCol">         
         <a-select v-decorator="['sysWindowCode']" placeholder="選択してください" >
          <a-select-option v-for="d in scanIdArr" :key="d.id" :value="d.id" >{{d.name}}</a-select-option>
          
        </a-select>
        </a-form-item>


       <a-form-item label="機種名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'modelName', validatorRules.modelName]" placeholder="機種名を入力してください"></a-input>
        </a-form-item>
     
        <a-form-item label="端末名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'terminalName', validatorRules.terminalName]" placeholder="端末名を入力してください"></a-input>
        </a-form-item>
        <a-form-item label="HOST名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'hostName', validatorRules.hostName]" placeholder="HOST名を入力してください"></a-input>
        </a-form-item>
        <a-form-item label="MACアドレス" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'macAdress', validatorRules.macAdress]" placeholder="MACアドレスを入力してください"></a-input>
        </a-form-item>
       
        <a-form-item label="接続先URL" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'destinationUrl', validatorRules.destinationUrl]" placeholder="接続先URLを入力してください"></a-input>
        </a-form-item>
         </a-form>
     
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction,getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import {CheckTemCode } from '@/api/api'

  export default {
    name: "TerminalInfoModal",
    components: { 
      JDictSelectTag,
    },
    data () {
      return {
        terminalSegment:'',
        displayflag:false,
        form: this.$form.createForm(this),
        title:"オペレーション",
        width:800,
        visible: false,        
        scanIdArr:{},
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
        terminalName:{rules: [{ required: true, message: '端末を選んでください!' }]},
        hostName:{rules: [{ required: true, message: 'HOST名を入力してください!' }]},
        macAdress:{rules: [{ required: true, message: 'MACアドレスを入力してください!' }]},
        modelName:{rules: [{ required: true, message: '機種名を入力してください!' }]},
        destinationUrl:{rules: [{ required: true, message: '接続先URLを入力してください!' }]},
        terminalSegment:{rules: [{ required: true, message: '端末区分を入力してください!' }]},
        terminalCode:{rules: [
          { required: true, message: 'エンドコードを入力してください'}
          // {required: true,validator:this.checkCode,trigger: 'blur'} 
          ]},
        },
        url: {
          add: "/terminal/terminalInfo/add",
          edit: "/terminal/terminalInfo/edit",
          checkCode:"/terminal/terminalInfo/queryByCode",
          listWindows:"/terminal/terminalInfo/listWindows"
        }     
      }
    },
    created () {
       this.getWindowIds();
    },
    methods: {
       checkCode(rule, value, callback)  {
        var params = {
          
          "code":value.terminalCode
        
        }
        CheckTemCode(params).then(res => {
          if (res.success) {
            callback()
          } else {
            callback("データは既に存在します。再入力してください")
          }
        })
    },
    //choose Type
    selectType( )
    {  
      this.$nextTick(() => {
          console.log(this.form.getFieldsValue().terminalSegment);
          let val= this.form.getFieldsValue().terminalSegment;
          if(val=='2')
          {
            this.displayflag=true;
          }else
          {
              this.displayflag=false;
          } 
         });
          
     
    },
     getWindowIds()
      {    
       let httpurl=this.url.listWindows;
       getAction(httpurl).then((res)=>{
       
            
               if (res.success)
                {
                     
                this.scanIdArr =res.result || [];  
                           
                
              } 
            }) 
       },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);       
        this.visible = true;
          let val= this.model.terminalSegment;
          if(val=='2')
          {
            this.displayflag=true;
          }else
          {
              this.displayflag=false;
          } 
        this.$nextTick(() => {         
          this.form.setFieldsValue(pick(this.model,'sysWindowCode','terminalName','hostName','macAdress','modelName','destinationUrl','terminalSegment','terminalCode'))
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
        this.form.setFieldsValue(pick(row,'sysWindowCode','terminalName','hostName','macAdress','modelName','destinationUrl','terminalSegment','terminalCode'))
      },

      
    }
  }
</script>