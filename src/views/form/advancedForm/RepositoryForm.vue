<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="倉庫名">
          <a-input
            placeholder="倉庫名を入力してください。"
            v-decorator="[
              'repository.name',
              {rules: [{ required: true, message: '倉庫名を入力してください。', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="リポジトリドメイン名">
          <a-input
            addonBefore="http://"
            addonAfter=".com"
            placeholder="入力してください"
            v-decorator="[
              'repository.domain',
              {rules: [{ required: true, message: '倉庫のドメイン名を入力してください', whitespace: true}, {validator: validate}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="倉庫管理者">
          <a-select placeholder="管理者を選択してください" v-decorator="[ 'repository.manager', {rules: [{ required: true, message: '管理者を選択してください'}]} ]">
            <a-select-option value="王さん">王さん</a-select-option>
            <a-select-option value="李さん">李さん</a-select-option>
            <a-select-option value="黄さん">黄さん</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="決裁人">
          <a-select placeholder="審査員を選んでください" v-decorator="[ 'repository.auditor', {rules: [{ required: true, message: '審査員を選んでください'}]} ]">
            <a-select-option value="王暁麗">王暁麗</a-select-option>
            <a-select-option value="李軍">李軍</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="発効日">
          <a-range-picker
            style="width: 100%"
            v-decorator="[
              'repository.effectiveDate',
              {rules: [{ required: true, message: '発効日を選択してください。'}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="リポジトリのタイプ">
          <a-select
            placeholder="倉庫のタイプを選択してください"
            v-decorator="[
              'repository.type',
              {rules: [{ required: true, message: '倉庫のタイプを選択してください'}]}
            ]" >
            <a-select-option value="公開する">公開する</a-select-option>
            <a-select-option value="秘密">秘密</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit" >Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
  export default {
    name: "RepositoryForm",
    props: {
      showSubmit: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        form: this.$form.createForm(this)
      }
    },
    methods: {
      handleSubmit (e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$notification['error']({
              message: 'Received values of form:',
              description: values
            })
          }
        })
      },
      validate (rule, value, callback) {
        const regex = /^user-(.*)$/
        if (!regex.test(value)) {
          callback('user-で始まる必要があります。')
        }
        callback()
      }
    }
  }
</script>

<style scoped>

</style>