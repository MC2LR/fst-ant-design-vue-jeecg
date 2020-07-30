<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <result title="操作が成功しました" :is-success="true" description="二時間以内に入金する予定です">
        <div class="information">
          <a-row>
            <a-col :sm="8" :xs="24">支払い口座：</a-col>
            <a-col :sm="16" :xs="24">ant-design@alipay.com</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">入金口座：</a-col>
            <a-col :sm="16" :xs="24">test@example.com</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">受取人の名前：</a-col>
            <a-col :sm="16" :xs="24">かぐや</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">振替金額：</a-col>
            <a-col :sm="16" :xs="24"><span class="money">500</span> 元</a-col>
          </a-row>
        </div>
        <div slot="action">
          <a-button type="primary" @click="finish">もう一回回ってください</a-button>
          <a-button style="margin-left: 8px" @click="toOrderList">請求書を確認する</a-button>
        </div>
      </result>
    </a-form>
  </div>
</template>

<script>
  import Result from '../../result/Result'

  export default {
    name: "Step3",
    components: {
      Result
    },
    data () {
      return {
        loading: false
      }
    },
    methods: {
      finish () {
        this.$emit('finish')
      },
      toOrderList () {
        this.$router.push('/list/query-list')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .information {
    line-height: 22px;

    .ant-row:not(:last-child) {
      margin-bottom: 24px;
    }
  }
  .money {
    font-family: "Helvetica Neue",sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
  }
</style>