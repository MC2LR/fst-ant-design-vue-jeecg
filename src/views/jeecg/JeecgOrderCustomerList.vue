<template>
<div><a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="事前预约可否" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['orderFlag']" :trigger-change="true" dictCode="" placeholder="请选择事前预约可否"/>
        </a-form-item>
        <a-form-item label="预约开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'orderDateStart', validatorRules.orderDateStart]" placeholder="请输入预约开始时间"></a-input>
        </a-form-item>
        <a-form-item label="预约结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'orderDateEnd', validatorRules.orderDateEnd]" placeholder="请输入预约结束时间"></a-input>
        </a-form-item>
        <a-form-item label="预约间隔时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'orderDateInterval', validatorRules.orderDateInterval]" placeholder="请输入预约间隔时间" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="呼出list通知件数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'notificationsNumber', validatorRules.notificationsNumber]" placeholder="请输入呼出list通知件数" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="リセット時間" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'resetDate', validatorRules.resetDate]" placeholder="请输入リセット時間"></a-input>
        </a-form-item>

      </a-form>
    </a-spin></div>
</template>

<script>

  
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>