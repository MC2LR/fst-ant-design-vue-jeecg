<template>
  <div :style="{ padding: '0' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>

    <v-chart ref="chart" :forceFit="true" :height="height" :data="dataSource" :scale="scale">
      <v-tooltip :shared="false"/>
      <v-axis/>
      <v-line position="x*y" :size="lineSize" :color="lineColor"/>
      <v-area position="x*y" :color="color"/>
    </v-chart>

  </div>
</template>

<script>
  import { triggerWindowResizeEvent } from '@/utils/util'

  export default {
    name: 'AreaChartTy',
    props: {
      // チャートデータ
      dataSource: {
        type: Array,
        required: true
      },
      // チャートのタイトル
      title: {
        type: String,
        default: ''
      },
      // x軸エイリアス
      x: {
        type: String,
        default: 'x'
      },
      // y軸エイリアス
      y: {
        type: String,
        default: 'y'
      },
      // Y軸の最小値
      min: {
        type: Number,
        default: 0
      },
      // Y軸最大
      max: {
        type: Number,
        default: null
      },
      // チャートの高さ
      height: {
        type: Number,
        default: 254
      },
      // 線の太さ
      lineSize: {
        type: Number,
        default: 2
      },
      // エリアカラー
      color: {
        type: String,
        default: ''
      },
      // 線の色
      lineColor: {
        type: String,
        default: ''
      }
    },
    computed: {
      scale() {
        return [
          { dataKey: 'x', title: this.x, alias: this.x },
          { dataKey: 'y', title: this.y, alias: this.y, min: this.min, max: this.max }
        ]
      }
    },
    mounted() {
      triggerWindowResizeEvent()
    }
  }
</script>

<style lang="scss" scoped>
  @import "chart";
</style>