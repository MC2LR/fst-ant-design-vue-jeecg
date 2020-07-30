<template>
  <j-select-biz-component
    :value="value"

    name="ユーザー"
    displayKey="realname"

    :listUrl="url.list"
    :columns="columns"
    queryParamText="アカウント"

    v-on="$listeners"
    v-bind="$attrs"
  />
</template>

<script>
  import JSelectBizComponent from './JSelectBizComponent'

  export default {
    name: 'JSelectMultiUser',
    components: { JSelectBizComponent },
    props: ['value'],
    data() {
      return {
        url: { list: '/sys/user/list' },
        columns: [
          { title: '姓名', align: 'center', width: 100, dataIndex: 'realname' },
          { title: 'アカウント', align: 'center', width: 100, dataIndex: 'username' },
          { title: '電話番号', align: 'center', width: 100, dataIndex: 'phone' },
          { title: '生年月日', align: 'center', width: 100, dataIndex: 'birthday' }
        ]
      }
    },
    watch: {
      $attrs: {
        deep: true,
        immediate: true,
        handler(val) {
          if (!val.returnKeys) {
            val.returnKeys = ['id', 'username']
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped></style>