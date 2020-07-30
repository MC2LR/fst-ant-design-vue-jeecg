<template>
  <j-select-biz-component v-bind="configs" v-on="$listeners"/>
</template>

<script>
  import JSelectBizComponent from './JSelectBizComponent'

  export default {
    name: 'JSelectPosition',
    components: { JSelectBizComponent },
    props: ['value'],
    data() {
      return {
        settings: {
          name: '役職',
          displayKey: 'name',
          returnKeys: ['id', 'code'],
          listUrl: '/sys/position/list',
          queryParamText: '役職番号',
          columns: [
            { title: '役職名', dataIndex: 'name', align: 'center', width: 100 },
            { title: '役職番号', dataIndex: 'code', align: 'center', width: 100 },
            { title: 'ランク', dataIndex: 'rank_dictText', align: 'center', width: 100 }
          ]
        }
      }
    },
    computed: {
      configs() {
        return Object.assign({ value: this.value }, this.settings, this.$attrs)
      }
    }
  }
</script>

<style lang="scss" scoped></style>