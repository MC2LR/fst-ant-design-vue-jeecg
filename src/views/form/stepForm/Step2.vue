<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <a-alert
        :closable="true"
        message="振込確認後、直接に相手の口座に入金されますので、返却できません"
        style="margin-bottom: 24px;"
      />
      <a-form-item
        label="支払い口座"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
        class="stepFormText"
      >
        ant-design@alipay.com
      </a-form-item>
      <a-form-item
        label="入金口座"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
        class="stepFormText"
      >
        test@example.com
      </a-form-item>
      <a-form-item
        label="受取人の名前"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
        class="stepFormText"
      >
        Alex
      </a-form-item>
      <a-form-item
        label="振替金額"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
        class="stepFormText"
      >
        ￥ 5,000.00
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button :loading="loading" type="primary" @click="nextStep">送信</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">前へ</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  export default {
    name: "Step2",
    data () {
      return {
        loading: false
      }
    },
    methods: {
      nextStep () {
        let that = this
        that.loading = true
        setTimeout(function () {
          that.$emit('nextStep')
        }, 1500)
      },
      prevStep () {
        this.$emit('prevStep')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

</style>