<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="タイトル"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: 'タイトルを入力してください' }]}
          ]"
          name="name"
          placeholder="目標に名前をつける" />
      </a-form-item>
      <a-form-item
        label="起止日"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-range-picker
          name="buildTime"
          style="width: 100%"
          v-decorator="[
            'buildTime',
            {rules: [{ required: true, message: '終了日を選択してください。' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="ターゲットの説明"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea
          rows="4"
          placeholder="段階的な作業目標を入力してください。"
          v-decorator="[
            'description',
            {rules: [{ required: true, message: 'ターゲットの説明を入力してください' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="尺度"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea
          rows="4"
          placeholder="測定基準を入力してください"
          v-decorator="[
            'type',
            {rules: [{ required: true, message: '測定基準を入力してください' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="取引先"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input 
          placeholder="お客様のサービスについて説明してください。内部のお客様は直接@名前/工号です"
          v-decorator="[
            'customer',
            {rules: [{ required: true, message: 'サービスのお客様について説明してください。' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="評議者を招く"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input placeholder="直接@名前/工号をお願いします。最大5人まで招待できます。" />
      </a-form-item>
      <a-form-item
        label="重み"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input-number :min="0" :max="100" />
        <span> %</span>
      </a-form-item>
      <a-form-item
        label="ターゲット公開"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
        help="お客様、評価者はデフォルトで共有されます。"
      >
        <a-radio-group v-model="value">
          <a-radio :value="1">公開する</a-radio>
          <a-radio :value="2">一部公開</a-radio>
          <a-radio :value="3">非公開</a-radio>
        </a-radio-group>
        <a-form-item>
          <a-select mode="multiple" v-if="value === 2">
            <a-select-option value="4">同僚1</a-select-option>
            <a-select-option value="5">同僚2</a-select-option>
            <a-select-option value="6">同僚3</a-select-option>
          </a-select>
        </a-form-item>
      </a-form-item>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary">送信</a-button>
        <a-button style="margin-left: 8px">保存</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
  export default {
    name: 'BaseForm',
    data () {
      return {
        description: 'フォームページは、ユーザに情報を収集または検証するために使用され、ベースフォームはデータ項目の少ないフォームシーンによく見られます。',
        value: 1,

        // form
        form: this.$form.createForm(this),

      }
    },
    methods: {

      // handler
      handleSubmit (e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            // eslint-disable-next-line no-console
            console.log('Received values of form: ', values)
          }
        })
      }
    }
  }
</script>