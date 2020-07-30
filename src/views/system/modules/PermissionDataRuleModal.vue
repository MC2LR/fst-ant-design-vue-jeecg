<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_MenuRulename')">
          <a-input :placeholder="$t('system_MenuRuleAddMsg')" v-decorator="['ruleName', validatorRules.ruleName]"/>
        </a-form-item>
        <a-form-item
          v-show="showRuleColumn"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_Menufield')">
          <a-input :placeholder="$t('system_MenufieldAddMsg')" v-decorator="['ruleColumn', validatorRules.ruleColumn]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_MenuConditional')">
          <j-dict-select-tag @change="handleChangeRuleCondition" v-decorator="['ruleConditions', validatorRules.ruleConditions]" :placeholder="$t('system_MenuConditionalAddMsg')" :triggerChange="true" dictCode="rule_conditions"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_MenuRuleValue')">
          <a-input :placeholder="$t('system_MenuRuleValueMsg')" v-decorator="['ruleValue', validatorRules.ruleValue]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_Menustatus')">
          <a-radio-group buttonStyle="solid" v-decorator="['status',{initialValue:'1'}]">
            <a-radio-button value="1">{{$t('system_MenuRulestatusMsg0')}}</a-radio-button>
            <a-radio-button value="0">{{$t('system_MenuRulestatusMsg1')}}</a-radio-button>
          </a-radio-group>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'

  export default {
    name: 'PermissionDataRuleModal',
    data() {
      return {
        queryParam: {},
        title: this.$t('system_Menuoperation'),
        visible: false,
        model: {},
        ruleConditionList: [],
        labelCol: {
          xs: {span: 24},
          sm: {span: 5}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16}
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        permissionId: '',
        validatorRules: {
          ruleConditions: {rules: [{required: true, message: this.$t('system_MenuConditionalAddMsg')}]},
          ruleName: {rules: [{required: true, message: this.$t('system_MenuRuleAddMsg') }]},
          ruleValue: {rules: [{required: true, message: this.$t('system_MenuRuleValueMsg') }]},
          ruleColumn: {rules: []}
        },
        url: {
          list: '/sys/dictItem/list',
          add: '/sys/permission/addPermissionRule',
          edit: '/sys/permission/editPermissionRule'
        },
        showRuleColumn:true
      }
    },
    created() {
    },
    methods: {
      add(permId) {
        this.permissionId = permId
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        if (record.permissionId) {
          this.model.permissionId = record.permissionId
        } else {
          this.model.permissionId = this.permissionId
        }
        this.visible = true
        this.initRuleCondition()
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'status','ruleName', 'ruleColumn', 'ruleConditions', 'ruleValue'))
        })
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            let formData = Object.assign(this.model, values)
            if(formData.ruleColumn && formData.ruleColumn.length>0){
              formData.ruleColumn = formData.ruleColumn.trim()
            }
            if(formData.ruleValue && formData.ruleValue.length>0){
              formData.ruleValue = formData.ruleValue.trim()
            }
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      initRuleCondition(){
        if(this.model.ruleConditions && this.model.ruleConditions=='USE_SQL_RULES'){
          this.showRuleColumn = false
        }else{
          this.showRuleColumn = true
        }
      },
      handleChangeRuleCondition(val){
        if(val=='USE_SQL_RULES'){
          this.form.setFieldsValue({
            ruleColumn:''
          })
          this.showRuleColumn = false
        }else{
          this.showRuleColumn = true
        }
      }
    }
  }
</script>

<style scoped>

</style>