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

        <a-form-item label="業務分類名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'businessTypeName', validatorRules.businessTypeName]" placeholder="業務分類名をご入力ください"></a-input>
        </a-form-item>
        <a-form-item label="業務分類コード" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'typeCode', validatorRules.typeCode]" placeholder="業務分類コードをご入力ください"></a-input>
        </a-form-item>
        <a-form-item label="業務階層１" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--<a-input v-decorator="[ 'business1', validatorRules.business1]" placeholder="業務階層１をご入力ください"></a-input>-->
          <a-select v-decorator="['business1', {}]" placeholder="業務階層１をご入力ください">
            <a-select-option
              v-for="business in business1List"
              :key="business.id"
              :value="business.id"
            >{{ business.bname }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="業務階層２" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--<a-input v-decorator="[ 'business2', validatorRules.business2]" placeholder="業務階層２をご入力ください"></a-input>-->
          <a-select v-decorator="['business2', {}]" placeholder="業務階層２をご入力ください">
            <a-select-option
              v-for="business in business2List"
              :key="business.id"
              :value="business.id"
            >{{ business.bname }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="業務階層３" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--<a-input v-decorator="[ 'business3', validatorRules.business3]" placeholder="業務階層３をご入力ください"></a-input>-->
          <a-select v-decorator="['business3', {}]" placeholder="業務階層３をご入力ください">
            <a-select-option
              v-for="business in business3List"
              :key="business.id"
              :value="business.id"
            >{{ business.bname }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="業務階層４" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--<a-input v-decorator="[ 'business4', validatorRules.business4]" placeholder="業務階層４をご入力ください"></a-input>-->
          <a-select v-decorator="['business4', {}]" placeholder="業務階層４をご入力ください">
            <a-select-option
              v-for="business in business4List"
              :key="business.id"
              :value="business.id"
            >{{ business.bname }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="業務階層５" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--<a-input v-decorator="[ 'business5', validatorRules.business5]" placeholder="業務階層５をご入力ください"></a-input>-->
          <a-select v-decorator="['business5', {}]" placeholder="業務階層５をご入力ください">
            <a-select-option
              v-for="business in business5List"
              :key="business.id"
              :value="business.id"
            >{{ business.bname }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="採番グループ" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--<a-input v-decorator="[ 'sysNumberCode', validatorRules.sysNumberCode]" placeholder="採番グループをご入力ください"></a-input>-->
          <a-select v-decorator="['sysNumberCode', {}]" placeholder="採番グループをご入力ください">
            <a-select-option
              v-for="numSetGpCd in numSetGpCdList"
              :key="numSetGpCd.id"
              :value="numSetGpCd.id"
            >{{ numSetGpCd.numGroupName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="窓口" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--v-decorator="['sysWindowCodes', {}]"<a-input v-decorator="[ 'sysWindowCodes', validatorRules.sysWindowCodes]" placeholder="窓口をご入力ください"></a-input>-->
          <a-select 
          placeholder="窓口をご入力ください" 
            mode="multiple"
            optionFilterProp="children"
            v-model="sysWindowCodes"
          >
            <a-select-option
              v-for="window in windowCodes"
              :key="window.id"
              :value="window.id"
            >{{ window.name }}</a-select-option>
          </a-select>

        </a-form-item>
        <a-form-item label="均処理時間" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'averageTime', validatorRules.averageTime]" placeholder="均処理時間をご入力ください"></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { getAction } from '@/api/manage'
  export default {
    name: "BusinessTypeModal",
    components: { 
    },
    data () {
      return {
        business1List:[],
        business2List:[],
        business3List:[],
        business4List:[],
        business5List:[],
        numSetGpCdList:[],
        windowCodes:[],
        sysWindowCodes:[],
        //editflag:true,
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
        name:{},
        typeId:{},
        business1:{},
        business2:{},
        business3:{},
        business4:{},
        business5:{},
        },
        url: {
          add: "/test/businessType/add",
          edit: "/test/businessType/edit",
          businessList:"/business/businessTable/CobList",
          numSetGpCdList:"/numset/sysNumSet/GetNumSetGpCbo",
          windowCodes:"/test/window/GetWindowCodes",
          selectWindow:"/test/businessType/selectWindows",
        }
     
      }
    },
    created () {
      this.getBusinCombox("01");
      this.getBusinCombox("02");
      this.getBusinCombox("03");
      this.getBusinCombox("04");
      this.getBusinCombox("05");
      this.GetNumSetGp();
      this.GetWindowCodes();
    },
    methods: {
      add () {
        this.edit({});
        //this.editflag=false;
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        //console.log("editflag:"+this.editflag);
        //if(this.editflag){
           this.GetSelectWindow(this.model);
        //}
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'businessTypeName','typeCode','business1','business2','business3','business4','business5','sysNumberCode','sysWindowCodes','averageTime'))
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
            this.model.sysWindowCodes= this.sysWindowCodes;
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
        this.form.setFieldsValue(pick(row,'businessTypeName','typeCode','business1','business2','business3','business4','business5','sysNumberCode','sysWindowCodes','averageTime'))
      },
      getBusinCombox (pram) {
        getAction(this.url.businessList,{"businDiv":pram}).then((res) => {
              if (res!= null) {
                console.log(res)
                switch(pram) {
                    case "01":
                        this.business1List = res.result;
                        break;
                    case "02":
                        this.business2List = res.result;
                        break;
                    case "03":
                        this.business3List = res.result;
                        break;
                    case "04":
                        this.business4List = res.result;
                        break;
                    case "05":
                        this.business5List = res.result;
                        break;
                    default:
                        break;
                } 
              }
              if(res == null){
                this.$message.warning(res.message)
              }
            })
      },
      GetNumSetGp(){
        getAction(this.url.numSetGpCdList).then((res) => {
          if (res!= null) {
            console.log(res)
            this.numSetGpCdList = res.result;
          }
          if(res == null){
            this.$message.warning(res.message)
          }
        })
      },
      GetWindowCodes(){
        getAction(this.url.windowCodes).then((res) => {
          if (res!= null) {
            console.log(res)
            this.windowCodes = res.result;
          }
          if(res == null){
            this.$message.warning(res.message)
          }
        })
      },

      GetSelectWindow(obj){
        getAction(this.url.selectWindow,{"sysBusinTypeCode":obj.id}).then((res) => {
          if (res!= null) {
            console.log(res)
            this.sysWindowCodes = res.result;
                    //console.log("sysWindowCodes:"+this.sysWindowCodes);
                    
                    console.log("sysWindowCodes:"+this.model.sysWindowCodes);
          }
          if(res == null){
            this.$message.warning(res.message)
          }
        })
      },
    }
  }
</script>