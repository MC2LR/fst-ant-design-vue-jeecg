<template>
  <j-select-biz-component
    :value="value"

    name="役割"
    displayKey="roleName"

    :returnKeys="returnKeys"
    :listUrl="url.list"
    :columns="columns"
    queryParamText="役割コード"

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
        returnKeys: ['id', 'roleCode'],
        url: { list: '/sys/role/list' },
        columns: [
          { title: '役割名', dataIndex: 'roleName', align: 'center', width: 120 },
          { title: '役割コード', dataIndex: 'roleCode', align: 'center', width: 120 }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped></style>