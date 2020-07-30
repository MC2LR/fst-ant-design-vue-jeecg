<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="閉じる"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="古いパスワード">
          <a-input type="password" placeholder="古いパスワードを入力してください" v-decorator="[ 'oldpassword', validatorRules.oldpassword]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="新しいパスワード">
          <a-input type="password" placeholder="新しいパスワードを入力してください" v-decorator="[ 'password', validatorRules.password]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="新しいパスワード確認">
          <a-input type="password" @blur="handleConfirmBlur" placeholder="新しいパスワードを確認してください" v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { putAction } from '@/api/manage'

  export default {
    name: "UserPassword",
    data () {
      return {
        title:"パスワード変更",
        modalWidth:800,
        visible: false,
        confirmLoading: false,
        validatorRules:{
          oldpassword:{
            rules: [{
              required: true, message: '古いパスワードを入力してください!',
            }],
          },
          password:{
            rules: [{
              required: true, message: '新しいパスワードを入力してください!',
            }, {
              validator: this.validateToNextPassword,
            }],
          },
          confirmpassword:{
            rules: [{
              required: true, message: '新しいパスワードを確認してください!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          }
        },
        confirmDirty:false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        form:this.$form.createForm(this),
        url: "sys/user/updatePassword",
        username:"",
      }
    },
    methods: {
      show(uname){
        if(!uname){
          this.$message.warning("現在のシステムはユーザを登録していない!");
          return
        }else{
          this.username = uname
          this.form.resetFields();
          this.visible = true;
        }
      },
      handleCancel () {
        this.close()
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.selectedRole = [];
      },
      handleOk () {
        const that = this;
        // フォームの検証をトリガします
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let params = Object.assign({username:this.username},values)
            console.log("パスワードを変更してデータを提出します",params)
            putAction(this.url,params).then((res)=>{
              if(res.success){
                console.log(res)
                that.$message.success(res.message);
                that.close();
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
        })
      },
      validateToNextPassword  (rule, value, callback) {
        const form = this.form;
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback();
      },
      compareToFirstPassword  (rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('二回入力したパスワードが違います！');
        } else {
          callback()
        }
      },
      handleConfirmBlur  (e) {
        const value = e.target.value
        this.confirmDirty = this.confirmDirty || !!value
      }

    }
  }
</script>

<style scoped>

</style>

