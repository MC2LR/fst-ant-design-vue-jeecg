<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="閉じる ">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        
        <a-form-item label="受付画面名" :labelCol="labelCol" :wrapperCol="wrapperCol">         
         <a-select v-decorator="['scanId',{rules: [{ required: true, message: '選択してください!' }]}]" placeholder="選択してください" >
          <a-select-option v-for="d in scanIdArr" :key="d.id" :value="d.id" >{{d.name}}</a-select-option>
          
        </a-select>
        </a-form-item>
          <a-form-item label="受付日種類" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select v-decorator="['dateType',{rules: [{ required: true, message: '選択してください!' }]}]" placeholder="選択してください" >
          <a-select-option value="1">平日</a-select-option>
          <a-select-option value="2">土曜日</a-select-option>          
        </a-select>
          </a-form-item>
           <a-form-item label="受付時間" :labelCol="labelCol" :wrapperCol="wrapperCol">
           <a-input type="time"  style="width: 47%"  v-decorator="[ 'startTime', validatorRules.startTime]"></a-input>
           —
           <a-input type="time"  style="width: 48%" v-decorator="[ 'endTime', validatorRules.startTime]"></a-input>            
           </a-form-item>
         <a-form-item label="音声パターン" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select v-decorator="['voicePattern',{rules: [{ required: true, message: '選択してください!' }]}]" placeholder="選択してください" >
          <a-select-option value="1">平日</a-select-option>
          <a-select-option value="2">土曜日</a-select-option>          
        </a-select>
        </a-form-item>       
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction,getAction} from '@/api/manage'
  import pick from 'lodash.pick'  
  import JDate from '@/components/jeecg/JDate'  
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
   import moment from "moment"
  export default {
    name: "ScheduleInfoModal",
    components: { 
      JDate,
      JDictSelectTag,
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"オペレーション",
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
        startTime:{rules: [{ required: true, message: 'スタート時間を選んでください!' }]},
        endTime:{rules: [{ required: true, message: '終了時間を選んでください !' }]}
         
       
        },
         scanIdArr:{},
        voicePattern:{},
        url: {
          add: "/schedule/scheduleInfo/add",
          edit: "/schedule/scheduleInfo/edit",
          listIcons:"/schedule/scheduleInfo/listIcons"
        }
     
      }
    },
    created () {
      this.getIcons();
    },
    
    methods: {
      getIcons()
      {
      let httpurl=this.url.listIcons;
       getAction(httpurl).then((res)=>{
            
               if (res.success) {
                      
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
        //this.form.setFieldsValue({startTime:moment(this.model.startTime,'HH:mm')});
        //this.form.setFieldsValue({endTime:moment(this.model.endTime,'HH:mm')});
        
        this.$nextTick(() => {
         this.form.setFieldsValue(pick(this.model,'startTime','endTime','scanId','voicePattern','dateType'))
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
            //formData.startTime = formData.startTime? formData.startTime.format('HH:mm') : null;
            //formData.endTime = formData.endTime? formData.endTime.format('HH:mm') : null;

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
        this.form.setFieldsValue(pick(row,'startTime','endTime','scanId','voicePattern','dateType'))
      },

      
    }
  }
</script>