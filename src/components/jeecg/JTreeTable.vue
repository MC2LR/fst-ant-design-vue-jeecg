<template>
  <a-table
    :rowKey="rowKey"
    :columns="columns"
    :dataSource="dataSource"
    :expandedRowKeys="expandedRowKeys"
    v-bind="tableAttrs"
    v-on="$listeners"
    @expand="handleExpand"
    @expandedRowsChange="expandedRowKeys=$event">

    <template v-for="(slotItem) of slots" :slot="slotItem" slot-scope="text, record, index">
      <slot :name="slotItem" v-bind="{text,record,index}"></slot>
    </template>

  </a-table>
</template>

<script>
  import { getAction } from '@/api/manage'

  export default {
    name: 'JTreeTable',
    props: {
      rowKey: {
        type: String,
        default: 'id'
      },
      // どのクエリに基づいて、IDが渡された場合、IDに基づいたクエリ
      queryKey: {
        type: String,
        default: 'parentId'
      },
      queryParams: {
        type: Object,
        default: () => ({})
      },
      // 最上位を照会するときの値。最上位が0の場合、0を渡します
      topValue: {
        type: String,
        default: null
      },
      columns: {
        type: Array,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      childrenUrl: {
        type: String,
        default: null
      },
      tableProps: {
        type: Object,
        default: () => ({})
      },
      /** コンポーネントの作成時にデータをクエリするかどうか */
      immediateRequest: {
        type: Boolean,
        default: true
      },
      condition:{
        type:String,
        default:'',
        required:false
      }
    },
    data() {
      return {
        dataSource: [],
        expandedRowKeys: []
      }
    },
    computed: {
      getChildrenUrl() {
        if (this.childrenUrl) {
          return this.childrenUrl
        } else {
          return this.url
        }
      },
      slots() {
        let slots = []
        for (let column of this.columns) {
          if (column.scopedSlots && column.scopedSlots.customRender) {
            slots.push(column.scopedSlots.customRender)
          }
        }
        return slots
      },
      tableAttrs() {
        return Object.assign(this.$attrs, this.tableProps)
      }
    },
    watch: {
      queryParams: {
        deep: true,
        handler() {
          this.loadData()
        }
      }
    },
    created() {
      if (this.immediateRequest) this.loadData()
    },
    methods: {

      /** データを読み込んでいます*/
      loadData(id = this.topValue, first = true, url = this.url) {
        this.$emit('requestBefore', { first })

        if (first) {
          this.expandedRowKeys = []
        }

        let params = Object.assign({}, this.queryParams || {})
        params[this.queryKey] = id
        if(this.condition && this.condition.length>0){
          params['condition'] = this.condition
        }

        return getAction(url, params).then(res => {
          let list = []
          if (res.result instanceof Array) {
            list = res.result
          } else if (res.result.records instanceof Array) {
            list = res.result.records
          } else {
            throw '認識されないデータ型'
          }
          let dataSource = list.map(item => {
            // 子がマークされているかどうかを判断する
            if (item.hasChildren === true) {
              // dataIndexの値を持つ最初の列を見つけます
              let firstColumn
              for (let column of this.columns) {
                firstColumn = column.dataIndex
                if (firstColumn) break
              }
              // デフォルトの展開中に表示されるロード中の子を定義します実際の子データは展開中にのみロードされます。
              let loadChild = { id: `${item.id}_loadChild`, [firstColumn]: 'loading...', isLoading: true }
              item.children = [loadChild]
            }
            return item
          })
          if (first) {
            this.dataSource = dataSource
          }
          this.$emit('requestSuccess', { first, dataSource, res })
          return Promise.resolve(dataSource)
        }).finally(() => this.$emit('requestFinally', { first }))
      },

      /** 展開アイコンがクリックされたときに発生します */
      handleExpand(expanded, record) {
        // 展開されているかどうかを判断する
        if (expanded) {
          // 子の最初のアイテムが「読み込み中」とマークされているかどうかを判断し、マークされている場合はデータを読み込みます
          if (record.children[0].isLoading === true) {
            this.loadData(record.id, false, this.getChildrenUrl).then(dataSource => {
              // 処理されたデータを直接子に割り当てることができます
              if (dataSource.length === 0) {
                record.children = null
              } else {
                record.children = dataSource
              }
            })
          }
        }
      }

    }
  }
</script>

<style scoped>

</style>