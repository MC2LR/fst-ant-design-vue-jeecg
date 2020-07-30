<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="ジョブ名">
          <a-input placeholder="タスク名を入力してください。" v-decorator="[ 'task.name', {rules: [{ required: true, message: 'タスク名を入力してください。', whitespace: true}]} ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="タスクの説明">
          <a-input placeholder="タスクの説明を入力してください。" v-decorator="[ 'task.description', {rules: [{ required: true, message: 'タスクの説明を入力してください。', whitespace: true}]} ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="執行人">
          <a-select
            placeholder="実行者を選択してください"
            v-decorator="[
              'task.executor',
              {rules: [{ required: true, message: '実行者を選択してください'}]}
            ]" >
            <a-select-option value="黄麗々">黄麗々</a-select-option>
            <a-select-option value="李大刀">李大刀</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="責任者">
          <a-select
            placeholder="責任者を選んでください"
            v-decorator="[
              'task.manager',
              {rules: [{ required: true, message: '責任者を選んでください'}]}
            ]" >
            <a-select-option value="王偉">王偉</a-select-option>
            <a-select-option value="李紅軍">李紅軍</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="リマインダ時間">
          <a-time-picker
            style="width: 100%"
            v-decorator="[
              'task.time',
              {rules: [{ required: true, message: 'リマインダ時間を選択してください。'}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="タスクの種類">
          <a-select
            placeholder="タスクの種類を選択してください。"
            v-decorator="[ 'task.type', {rules: [{ required: true, message: 'タスクの種類を選択してください。'}]} ]" >
            <a-select-option value="タイミング実行">タイミング実行</a-select-option>
            <a-select-option value="サイクル実行">サイクル実行</a-select-option>
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
    name: "TaskForm",
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
      }
    }
  }
</script>

<style scoped>

</style>