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
          <a-input v-decorator="[ 'logoCode', validatorRules.logoCode]" placeholder="番号を入力してください"></a-input>
        </a-form-item>
        <a-form-item label="ロゴ名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'name', validatorRules.name]"  placeholder="ロゴ名を入力してください"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="ロゴタイプ" hasFeedback>
          <a-select v-decorator="['type', {}]" placeholder="ロゴタイプを選んでください">
            <a-select-option value="1">店内モニタ用ロゴ大（サイズ：◇px×▲px）</a-select-option>
            <a-select-option value="2">店内モニタ用ロゴ小（サイズ：■px×○px）</a-select-option>
            <a-select-option value="3">受付画面用ロゴ（サイズ：○px×△px）</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="ファイル"
          hasFeedback>
          <a-upload
            accept=".jpg,.png,.jpeg,.gif"
            :action="uploadAction"
            listType="picture-card"
            :headers="headers"
            :fileList="fileList"
            @change="handleChange"
            @preview="handlePreview">
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handlePicCancel">
            <img alt="example" style="width: 100%" :src="previewImage"/>
          </a-modal>
          <a-button @click="handlePicView(model.img)">
            <a-icon type="search"/>
            画像を見る
          </a-button>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="ファイルパス"
          :hidden="true"
          v-model="img"
          hasFeedback>
          <a-input v-decorator="[ 'img', {}]" disabled="disabled"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import { getUploadFileList,getFilePaths } from '@/utils/commonUploadFile.js'
  import { duplicateCheck } from '@/api/api'

  export default {
    name: "LogoModal",
    components: { 
    },
    computed: {
      uploadAction: function () {
        return this.url.fileUpload;
      }
    },
    data () {
      return {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        headers: {},
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
          name:{ rules: [{ required: true, message: '業務グループ名なし' }] },
          type:{},
          logoCode:{
            rules: [
              {
                required: true,
                message: "番号を入力してください"
              },
              {
                validator: this.myValidate
              }
            ]
          }
        },
        url: {
          add: "/test/logo/add",
          edit: "/test/logo/edit",
          checkCode: "/test/logo/queryByCode",
          fileUpload: window._CONFIG['domianURL'] + "/sys/common/upload",
          imgServer: window._CONFIG['domianURL'] + "/sys/common/view",
        },
        logoCode:'',
        img: '',
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
      console.log(token)
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
          this.form.setFieldsValue(pick(this.model,'name','type','img', 'logoCode'))
        });
        
        let currFileList = getUploadFileList(record.idcardPic);
        this.fileList = [...currFileList];
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
        this.form.setFieldsValue(pick(row,'name','type','img', 'logoCode'))
      },
      
      edit2(){
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'name','type','img', 'logoCode'))
        })
      },
      handleChange(info) {
        this.fileList = info.fileList;
        if (info.file.status === 'uploading') {
          return
        }
        if (info.file.status === 'done') {
          var response = info.file.response;
          this.img = response.message;
          
        this.model.img = this.img;
        this.edit2();
          if (!response.success) {
            this.$message.warning(response.message);
          }
        }
        console.log(this.previewImage)
      },
      handlePicCancel() {
        this.previewVisible = false
        this.previewImage=''
      },
      handlePicView(url){
        this.previewImage = this.url.imgServer + "/" + url;

        console.log("this.previewImage");
        console.log(this.previewImage);
        this.previewVisible = true
      },
      handlePreview(file) {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
      },
      getIdCardView(url) {
        console.log("this.url");
        console.log(this.url);
        return this.url.imgServer + "/" + url;
      },
      myValidate(rule, value, callback) {
        var params = {
          tableName: 'm_logo',
          fieldName: 'logo_code',
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