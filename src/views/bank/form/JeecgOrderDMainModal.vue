<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!-- 主表单区域 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('bankName')"
          hasFeedback>
          <a-input
            :placeholder="$t('writeBankName')"
            v-decorator="['name', {rules: [{ required: true, message: this.$t('writeBankName') }]}]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('phone')">
          <a-input style="width: 200px" v-decorator="[ 'phonenum', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('ownerName')">
          <a-input style="width: 200px" v-decorator="[ 'ownerName', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('bankaddress')">
          <a-input :placeholder="$t('writebankAddress')" v-decorator="['address', {}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import JDate from '@/components/jeecg/JDate'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "JeecgOrderDMainModal",
    components: {
      JDate
    },
    data() {
      return {
        title: this.$t('operation'),
        visible: false,
        orderMainModel: {
          jeecgOrderCustomerList: [{}],
          jeecgOrderTicketList: [{}]
        },
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        url: {
          add: "/test/bank/add",
          edit: "/test/bank/edit",
          // orderCustomerList: "/test/order/listOrderCustomerByMainId",
          // orderTicketList: "/test/order/listOrderTicketByMainId",
        },
      }
    },
    methods: {
      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.orderMainModel = Object.assign({}, record);
        //初始化明细表数据
        console.log(this.orderMainModel.id)
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.orderMainModel, 'name', 'address', 'phonenum','ownerName'))
          this.form.setFieldsValue({orderDate: this.orderMainModel.orderDate ? moment(this.orderMainModel.orderDate) : null}) //时间格式化
        });
        console.log(this.orderMainModel)
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.orderMainModel.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let orderMainData = Object.assign(this.orderMainModel, values);
            //时间格式化
            orderMainData.orderDate = orderMainData.orderDate ? orderMainData.orderDate.format('YYYY-MM-DD HH:mm:ss') : null;
            let formData = {
              ...orderMainData
            }

            console.log(formData)
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleCancel() {
        this.close()
      }
    }
  }
</script>

<style scoped>
  .ant-btn {
    padding: 0 10px;
    margin-left: 3px;
  }

  .ant-form-item-control {
    line-height: 0px;
  }

  /** 主表单行间距 */
  .ant-form .ant-form-item {
    margin-bottom: 10px;
  }

  /** Tab页面行间距 */
  .ant-tabs-content .ant-form-item {
    margin-bottom: 0px;
  }
</style>