<template>
  <a-date-picker
    :disabled="disabled || readOnly"
    :placeholder="placeholder"
    @change="handleDateChange"
    :value="momVal"
    :showTime="showTime"
    :format="dateFormat"
    :getCalendarContainer="getCalendarContainer"
  />
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'JDate',
    props: {
      placeholder:{
        type: String,
        default: '',
        required: false
      },
      value:{
        type: String,
        required: false
      },
      dateFormat:{
        type: String,
        default: 'YYYY-MM-DD',
        required: false
      },
      //この属性は廃止される可能性があります
      triggerChange:{
        type: Boolean,
        required: false,
        default: false
      },
      readOnly:{
        type: Boolean,
        required: false,
        default: false
      },
      disabled:{
        type: Boolean,
        required: false,
        default: false
      },
      showTime:{
        type: Boolean,
        required: false,
        default: false
      },
      getCalendarContainer: {
        type: Function,
        default: () => document.body
      }
    },
    data () {
      let dateStr = this.value;
      return {
        decorator:"",
        momVal:!dateStr?null:moment(dateStr,this.dateFormat)
      }
    },
    watch: {
      value (val) {
        if(!val){
          this.momVal = null
        }else{
          this.momVal = moment(val,this.dateFormat)
        }
      }
    },
    methods: {
      moment,
      handleDateChange(mom,dateStr){
        this.$emit('change', dateStr);
      }
    },
    //2.2コンポーネントの新しい定義親コンポーネントが呼び出されたときに、値を渡すプロパティとイベントタイプを指定する
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>
