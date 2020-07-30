<template>
  <a-row class="j-select-biz-component-box" type="flex" :gutter="8">
    <a-col class="left" :class="{'full': !buttons}">
      <a-select
        mode="multiple"
        :placeholder="placeholder"
        v-model="selectValue"
        :options="selectOptions"
        allowClear
        :disabled="disabled"
        :open="false"
        style="width: 100%;"
        @click.native="visible=(buttons?visible:true)"
      />
    </a-col>

    <a-col v-if="buttons" class="right">
      <a-button type="primary" icon="search" :disabled="disabled" @click="visible=true">{{selectButtonText}}</a-button>
    </a-col>

    <j-select-biz-component-modal
      v-model="selectValue"
      :name="name" :listUrl="listUrl" :returnKeys="returnKeys" :displayKey="displayKey"
      :propColumns="columns" :queryParamText="queryParamText" :multiple="multiple"
      :visible.sync="visible"
      :valueKey="valueKey"
      @ok="selectOptions=$event"
    />
  </a-row>
</template>

<script>
  import JSelectBizComponentModal from './JSelectBizComponentModal'

  export default {
    name: 'JSelectBizComponent',
    components: { JSelectBizComponentModal },
    props: {
      value: {
        type: String,
        default: ''
      },
      /** IDを返すかどうか，デフォルトはfalse，リターン　コード */
      returnId: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '選択してください'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      // 複数選択をサポートするかどうか、デフォルトはtrue
      multiple: {
        type: Boolean,
        default: true
      },
      // ボタンを表示するかどうか、デフォルトはtrue
      buttons: {
        type: Boolean,
        default: true
      },

      /* 再利用可能な属性 */

      // 選択した名前。たとえば、部門を選択した場合、「部門」を入力します
      name: {
        type: String,
        default: ''
      },
      // list インターフェースアドレス
      listUrl: {
        type: String,
        required: true,
        default: ''
      },
      // 表示されたキー
      displayKey: {
        type: String,
        default: null
      },
      //返されたキー
      returnKeys: {
        type: Array,
        default: () => ['id', 'id']
      },
      // ボタンのテキストを選択
      selectButtonText: {
        type: String,
        default: '選ぶ'
      },
      // クエリ条件テキスト
      queryParamText: {
        type: String,
        default: null
      },
      // columns
      columns: {
        type: Array,
        default: () => []
      }

    },
    data() {
      return {
        selectValue: [],
        selectOptions: [],
        visible: false
      }
    },
    computed: {
      valueKey() {
        return this.returnId ? this.returnKeys[0] : this.returnKeys[1]
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (val) {
            this.selectValue = val.split(',')
          } else {
            this.selectValue = []
          }
        }
      },
      selectValue: {
        deep: true,
        handler(val) {
          const data = val.join(',')
          this.$emit('input', data)
          this.$emit('change', data)
        }
      }
    },
    methods: {}
  }
</script>

<style lang="scss">
  .j-select-biz-component-box {
    .ant-select-search__field {
      display: none !important;
    }
  }
</style>
<style lang="scss" scoped>
  .j-select-biz-component-box {

    $width: 82px;

    .left {
      width: calc(100% - #{$width} - 8px);
    }

    .right {
      width: #{$width};
    }

    .full {
      width: 100%;
    }
  }
</style>