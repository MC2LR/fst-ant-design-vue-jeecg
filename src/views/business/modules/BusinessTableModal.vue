<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :cancelText="$t('close')"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="$t('bname')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'bname', validatorRules.bname]" :placeholder="$t('bnameInput')"></a-input>
        </a-form-item>

        <a-form-item :label="$t('level')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-decorator="[ 'level', validatorRules.level]" :placeholder="$t('levelInput')"></a-input> -->
          <a-select  :placeholder="$t('levelInput')" v-decorator="[ 'level', validatorRules.level]">
                <a-select-option value="1">1番</a-select-option>
                <a-select-option value="2">2番</a-select-option>
                <a-select-option value="3">3番</a-select-option>
                <a-select-option value="4">4番</a-select-option>
                <a-select-option value="5">5番</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item :label="$t('averageTime')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-select  :placeholder="$t('averageTimeInput')" v-decorator="[ 'averageTime',validatorRules.averageTime]">
                <a-select-option :value="5">5分</a-select-option>
                <a-select-option :value="10">10分</a-select-option>
                <a-select-option :value="15">15分</a-select-option>
                <a-select-option :value="20">20分</a-select-option>
                <a-select-option :value="25">25分</a-select-option>
                <a-select-option :value="30">30分</a-select-option>
            </a-select> -->
            <a-input-number style="width:100%" :min="1" :placeholder="$t('averageTimeInput')" v-model="value" v-decorator="[ 'averageTime',validatorRules.averageTime]"/>
        </a-form-item>

        <a-form-item
            :label="$t('peopleNum')"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            style="width: 100%"
          >
            <a-select :placeholder="$t('peopleNumInput')" v-decorator="[ 'numId', validatorRules.numId]">
                <!-- <a-select-option v-for="(num,index) in numSet" :key="index" :value="num.id">{{num.numGroupName}}</a-select-option> -->
                <a-select-option value="01">{{$t('peopleNum')}} 01</a-select-option>
                <a-select-option value="02">{{$t('peopleNum')}} 02</a-select-option>
                <a-select-option value="03">{{$t('peopleNum')}} 03</a-select-option>
                <a-select-option value="04">{{$t('peopleNum')}} 04</a-select-option>
                <a-select-option value="05">{{$t('peopleNum')}} 05</a-select-option>
            </a-select>


            <!-- <a-select v-decorator="['numId', {}]" placeholder="请选择采番组" :disabled="true">
            <a-select-option
              v-for="(num, index) in numSet"
              :key="index"
              :value="num.id"
            >{{ num.realname }}</a-select-option>
          </a-select> -->
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import store from '@/store/'
import { queryBankIdTree } from '@/api/api'
import { queryOrgSelectList } from '@/api/api'
import { getAction } from '@/api/manage'
export default {
  name: 'BusinessTableModal',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      title: this.$t('operation'),
      width: 900,
      visible: false,
      model: {},
      fields: [],
      bankfields:[],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      validatorRules: {
        bname: {rules: [{ required: true, message: this.$t('bnameInput') }]},
        bnum: {rules: [{ required: true, message: this.$t('writeWindowName') }]},
        level: {rules: [{ required: true, message: this.$t('levelInput') }]},
        averageTime: {rules: [{ required: true, message: this.$t('averageTimeInput') }]},
        numId: {rules: [{ required: true, message: this.$t('peopleNumInput') }]},
        wholeNum: {rules: [{ required: true, message: this.$t('writeWindowName') }]},
        batchNum: {rules: [{ required: true, message: this.$t('writeWindowName') }]}
      },
      url: {
        add: '/business/businessTable/add',
        edit: '/business/businessTable/edit',
        numSetUrl: "/numset/sysNumSet/list",
        },
        numSet: [],
    }
  },
  created() {
    // this.getNumset()
  },
  mounted() {
    //初始化websocket
    this.initWebSocket()
  },
  destroyed: function() {
    // 离开页面生命周期函数
    this.websocketclose()
  },
  methods: {
    getNumset() {
      getAction(this.url.numSetUrl).then(res => {
        console.log(123546575859504)
        this.numSet = []
        if (res.success) {
          this.numSet = res.result.records
          console.log(this.numSet)
        } else {
          this.dataSource = null
          console.log('报错啦')
        }
      })
    },
    add() {
      this.edit({})
    },

    edit(record) {
      this.loadTreeData()
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'bname', 'level', 'averageTime','numId',)
        )
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
          console.log('表单提交数据', formData)
          httpAction(httpurl, formData, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    popupCallback(row) {
      this.form.setFieldsValue(pick(row, 'bname', 'bnum', 'level', 'averageTime', 'peopleNum', 'wholeNum', 'batchNum'))
    },
    //websocket
    initWebSocket: function() {
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      var userId = store.getters.userInfo.id
      var url =
        window._CONFIG['domianURL'].replace('https://', 'ws://').replace('http://', 'ws://') + '/websocket/' + userId
        console.log("链接")
        console.log(url);
      this.websock = new WebSocket(url)
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onmessage = this.websocketonmessage
      this.websock.onclose = this.websocketclose
    },
    websocketonopen: function() {
      console.log('WebSocket连接成功')
    },
    websocketonerror: function(e) {
      console.log('WebSocket连接发生错误')
    },
    websocketonmessage: function(e) {
      var data = eval('(' + e.data + ')')
      //处理订阅信息
      if (data.cmd == 'topic') {
        //TODO 系统通知
        console.log(e);
        console.log("收到了");
      } else if (data.cmd == 'user') {
        //TODO 用户消息
      }
    },
    websocketclose: function(e) {
      console.log('connection closed (' + e.code + ')')
    },
    loadTreeData(){
        var that = this;
        queryBankIdTree().then((res)=>{
          console.log("res.success:"+res.success);
          if(res.success){
            that.bankfields = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i];
              that.bankfields.push(temp);
            }
          }

        })
      },
    loadOrgSelectData(){
        var that = this;
        queryOrgSelectList().then((res)=>{
          console.log("res.success:"+res.success);
          if(res.success){
            that.fields = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i];
              that.fields.push(temp);
            }
          }

        })
      },
  }
}
</script>