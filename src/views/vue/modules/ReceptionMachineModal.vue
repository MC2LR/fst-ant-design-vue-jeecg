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
          <a-input v-decorator="[ 'layoutCode', validatorRules.layoutCode]" placeholder="番号を入力してください"></a-input>
        </a-form-item>
        <a-form-item label="受付画面名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'name', validatorRules.name]" placeholder="受付画面名を入力してください"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="ロゴ" hasFeedback>
          <a-select v-decorator="['logo', {}]" placeholder="ロゴを選んでください">
            <a-select-option v-for="(logo,index) in logoData" :key="index.toString()" :value="logo.id">{{ logo.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="業務ボタン数" hasFeedback>
          <a-select v-decorator="['businessBtnNum', {}]" placeholder="業務ボタン数を選んでください">
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
            <a-select-option value="4">4</a-select-option>
            <a-select-option value="5">5</a-select-option>
            <a-select-option value="6">6</a-select-option>
            <a-select-option value="7">7</a-select-option>
            <a-select-option value="8">8</a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item
          label="業務G配置"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select mode="multiple" style="width: 100%"  @change="handleChange" placeholder="業務G配置を選んでください"
          v-model="selectedBusinessGroup">
            <a-select-option
              v-for="(businessGroup,index) in businessGroupData"
              :key="index.toString()"
              :value="businessGroup.id"
            >{{ businessGroup.businessGroupName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="背景色" hasFeedback>
          <!-- <a-select v-decorator="['backgroundColor', {}]" placeholder="背景色を選んでください" 
            style="width: 80%">
            <a-select-option value="255,0,0">赤色</a-select-option>
            <a-select-option value="255,255,0">黄色</a-select-option>
            <a-select-option value="0,0,255">青い</a-select-option>
            <a-select-option value="0,128,0">緑色</a-select-option>
            <a-select-option value="128,0,128">パープル</a-select-option>
            <a-select-option value="255,192,203">ピンク</a-select-option>
          </a-select> -->
          
          <!-- <material-picker v-model="colors" /> -->
          <!-- <compact-picker v-model="colors" /> -->
          <!-- <swatches-picker v-model="colors" /> -->
          <slider-picker v-model="colors" />
          <!-- <sketch-picker v-model="colors" /> -->
          <!-- <chrome-picker v-model="colors" /> -->
          <!-- <photoshop-picker v-model="colors" /> -->
          <!-- <a-input v-decorator="[ 'backgroundColor', validatorRules.backgroundColor]" placeholder="背景色を選んでください" type="color" style="width: 20%"></a-input> -->
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="レイアウト" hasFeedback>
          <a-select v-decorator="['layout', {}]" placeholder="レイアウトを選んでください">
            <a-select-option value="1">レイアウト１</a-select-option>
            <a-select-option value="2">レイアウト２</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="待ち表示" hasFeedback>
          <a-select v-decorator="['waitDisplay', {}]" placeholder="待ち表示を選んでください">
            <a-select-option value="0">不表示</a-select-option>
            <a-select-option value="1">表示</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="ヘルプボタン有無" hasFeedback>
          <a-select v-decorator="['helpBtnDisplay', {}]" placeholder="ヘルプボタン有無を選んでください">
            <a-select-option value="0">無</a-select-option>
            <a-select-option value="1">有</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="キャンペーン文言" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'campaignText', validatorRules.campaignText]" placeholder="キャンペーン文言を入力してください"></a-input>
        </a-form-item>
        <a-form-item label="利用者ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'userId', validatorRules.userId]" placeholder="利用者IDを入力してください"></a-input>
        </a-form-item>
        <a-form-item label="変更設定パスワード" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-password v-decorator="[ 'pageChangePassword', validatorRules.pageChangePassword]" placeholder="画面変更設定パスワードを入力してください"></a-input-password>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { deleteAction, getAction,downFile } from '@/api/manage'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { duplicateCheck } from '@/api/api'
  import { Slider } from 'vue-color'

  export default {
    name: "ReceptionMachineModal",
    components: { 
      // 'material-picker': Material,
      // 'compact-picker': Compact,
      // 'swatches-picker': Swatches,
      'slider-picker': Slider,
      // 'sketch-picker': Sketch,
      // 'chrome-picker': Chrome,
      // 'photoshop-picker': Photoshop
    },
    data () {
      return {
        colors: {
          hex: '#194d33',
          hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
          hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
          rgba: { r: 25, g: 77, b: 51, a: 1 },
          a: 1
        },
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
        visible: false,
        model: {},
        selectedBusinessGroup:[],
        businessGroupData:[],
        logoData:[],
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
          layoutCode:{
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
          name:{rules: [{ required: true, message: '受付画面名を入力してください!' }]},
          logo:{},
          businessBtnNum:{},
          backgroundColor:{},
          businessGroup:{},
          waitDisplay:{},
          campaignText:{},
          helpBtnDisplay:{},
          pageChangePassword:{},
          userId:{},
        },
        url: {
          add: "/test/receptionMachine/add",
          edit: "/test/receptionMachine/edit",
          listBusinessGroup:"/test/businessGroup/list2",
          listLogo:"/test/logo/list2",
        },
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.headers = { 'X-Access-Token': token }
      try {
        this.loadBusinessGroup();
      } catch (error) {
        this.$message.error("loadBusinessGroup error 174line!")
      }
      this.selectedBusinessGroup = [];
    },
    methods: {
      handleChange(value) {
        console.log(`selected ${value}`);
      },
      add () {
        this.edit({});
      },
      edit (record) {
        
        this.loadBusinessGroup();
        this.loadLogo();
        this.form.resetFields();
        
        // this.loadUserBusinessGroup(record.id);
        this.model = Object.assign({}, record);
        this.visible = true;
        console.log("this.model.businessGroup")
        console.log(this.model.businessGroup)
        if (this.model.businessGroup) {
          this.model.businessGroup = this.model.businessGroup.split(',')
        }else{
          this.model.businessGroup = [];
        }
        this.selectedBusinessGroup = this.model.businessGroup;
        console.log("this.model.businessGroup2")
        console.log(this.model.businessGroup)
        // this.model.backgroundColor = this.model.backgroundColor.colorHex();
        try {
          this.colors = JSON.parse(this.model.backgroundColor)
        } catch (error) {

        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'name','layoutCode','logo', 'layout','waitDisplay','campaignText','helpBtnDisplay','pageChangePassword','userId'))
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.selectedBusinessGroup=[]
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
            console.log(this.model.backgroundColor)
            console.log(values)
            console.log(this.colors)
            values.backgroundColor = JSON.stringify(this.colors);
            // this.formData.backgroundColor = this.model.backgroundColor.colorRgb()
            // values.backgroundColor = this.model.backgroundColor.colorRgb()
            let formData = Object.assign(this.model, values);
            console.log(formData.backgroundColor)

            formData.businessGroup = null;

            if (typeof(this.selectedBusinessGroup) == "undefined")
            {
              // this.$message.warning("selectedBusinessGroup undefined 232line!")
              this.selectedBusinessGroup = [];
            }
            
            console.log(this.selectedBusinessGroup)
            try {
              this.selectedBusinessGroup.forEach(element => {
                if (formData.businessGroup != null) {
                    formData.businessGroup += ',' + element
                }else{
                    formData.businessGroup = element
                }
              });
            } catch (error) {
              this.$message.error("selectedBusinessGroup error 239line!")
            }
            console.log(this.selectedBusinessGroup.length.toString() )
            console.log(this.model.businessBtnNum)
            // if (this.selectedBusinessGroup.length.toString() != this.model.businessBtnNum) {
            //   this.$message.error("ビジネスグループの数は、ボタンの数と同じにする必要があります!")
            //   that.confirmLoading = false;
            // }else{

              // console.log(this.model.backgroundColor.colorRgb());
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
            // }
          }
         
        })
          this.selectedBusiness=[]
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        // row.backgroundColor = row.backgroundColor.colorHex();
        this.colors = JSON.parse(row.backgroundColor)
        this.form.setFieldsValue(pick(row,'name','layoutCode','logo', 'layout','businessGroup','waitDisplay','campaignText','helpBtnDisplay','pageChangePassword','userId'))
      },
      loadBusinessGroup(){
        getAction(this.url.listBusinessGroup,{isdel:"0"}).then(res => {
          console.log(res);
          this.businessGroupData=res.result;
        })
      },
      loadLogo(){
        getAction(this.url.listLogo,{isdel:"0"}).then(res => {
          this.logoData=res.result;
          console.log(this.logoData)
        })
      },
      myValidate(rule, value, callback) {
        var params = {
          tableName: 'm_Reception_Machine',
          fieldName: 'layout_code',
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