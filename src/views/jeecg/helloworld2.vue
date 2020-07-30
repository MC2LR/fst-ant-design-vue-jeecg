<template>
  <div>
    hello world!
  </div>
</template>
<script>
  export default {
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